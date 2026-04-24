<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

// this facade is for using Auth
use Illuminate\Support\Facades\Auth;


class UserController extends Controller
{
    // function that handles the sign in process, meaning it saves new user info to database using a User model.
    public function signIn (Request $request) {
        // sign in code goes here

        // validation rules.
        $input = $request->validate([
            'name' => 'required|min:3|unique:users,name',
            'gender' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:4'
        ]);

        // manually hashing password before creating new user account.
        $input['passsword'] = Hash::make($input['password']);
    
        // setting default image path to "none" cuz these profiles come with no pictures, therefore a 
        // profile pic is assigned depending on the gender.
        $input['profile_pic_path'] = 'none';

        // Creating new user account using the User model.
        $user = User::create($input);

        // returning user back to sign in page with a success message.
        return back()->with('message', 'your account has been created');
    }


    // Code for Log In.
    public function logIn(Request $request) {
        $input = $request->validate([
            'name'=> 'required',
            'password'=> 'required'
        ]);        

        if (Auth::attempt( ['name' =>$input['name'], 'password' => $input['password']])) {
            return view('home.home');
        }

        return back()->withErrors('check your username or password');
    }

    // Function to logout user and invalidate current session.
    public function logout(Request $request) {
        auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect('/');
    }



    // This function gets all posts current user has created only (not all posts).
    public function getPosts() {

        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'errorMessage' => 'no user logged in'
            ]);
        }

        $posts = $user->posts;

        return response()->json([
            'success' => true,
            'posts' => $posts
        ]);
    }

    public function editProfile(Request $request) {

        $input = Validator::make( $request->all(), [
            'name' => 'required|string|min:3',
            'email' => 'required|email',
            'bio' => 'required',
            'gender' => 'required'
        ],[
            'name.min' => 'Name must be 3 characters long at least',
            'email.email' => 'Invalid email format'
        ]);

        if ($input->fails()) {
            return back()->withErrors($input, 'editProfileErrors')->withInput();
        }

        $currentUser = auth()->user();

        $currentUser->update([
            'name' => $request->name,
            'email' => $request->email,
            'bio' => $request->bio,
            'gender' => $request->gender
        ]);

        return back()->with('success', 'changes were saved');
    }

    public function changeProfilePic(Request $request) {
  
        // File object.
        $img = $request->file('new-pic');

        // File name.
        $imgName = $img->getClientOriginalName();

        // Uploading/saving uploaded file to location inside my s3 bucket.
        $path = $img->storeAs('images/other_images', $imgName, 's3');
        

        // User object.
        $user = Auth()->user();

        // Deleting previous profile pic (if any) from s3 bucket.
        if ($user->profile_pic_path != 'none') {

            // Old profile pic name.
            $oldProfilePicName =$user->profile_pic_path;

            // Before deleting the old profile pic, we want to see if another user has the same profile pic, if they do, 
            // then we dont wanna delete it (since it will display for them).
            $otherUserHasSameProfilePic = User::where('profile_pic_path', '=', $oldProfilePicName)
                                                ->where('id', '!=', $user->id )
                                                ->exists();
            
            // If $otherUserHasSameProfilePic is false, then no other use has the same profile pic and we can
            // go ahead and delete the old profile pic from the s3 bucket.
            if (!$otherUserHasSameProfilePic) {
                Storage::disk('s3')->delete('images/other_images/' . $oldProfilePicName);
            }
        }

        // Updating object column in database "profile_pic_path".
        $user->profile_pic_path = $imgName;
        $user->save();

        return back();
    }
}


