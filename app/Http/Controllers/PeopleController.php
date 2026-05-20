<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

use Illuminate\Http\Request;

class PeopleController extends Controller
{
    public function getPeople(Request $request) {

        // authenticated user.
        $authUser = auth()->user();

        // List of IDs of the authUser's friends.
        $friendsIDs = $authUser->friends()->pluck('friend');


        // Get all users who arent the authenticated user and using the paginate method to not grab all of them at once.
        $people = User::where('id', '!=', $authUser->id)
                ->whereNotIn('id', $friendsIDs)
                ->paginate(5);

        // Here we use map() to add a new attribute called "profile_pic_s3_url". This new attribute contains the
        // s3 url which will then be used to display the user's profile pic. If the user has no profile pic, then this value is NULL
        $mappedPeople = $people->map(function ($user) {
            if ($user->profile_pic_path == 'none') {
                $user->profile_pic_s3_url = NULL;
            } else {
                $user->profile_pic_s3_url = Storage::disk('s3')->url('images/other_images/' . $user->profile_pic_path);;
            }

            return $user;
        });

        // Return JSON response.
        return response()->json(['people' => $mappedPeople, 'lastPage' => $people->lastPage()]);
    }

    // Method to create record in friend_requests pivot table.
    public function friendRequest(Request $request) {
        $json = $request->json()->all();

        // current logged in user.
        $currentLoggedInUser = auth()->user();

        $senderId = $currentLoggedInUser->id;
        $receiverId = $json['id'];

        // Creating record in pivot table.
        $currentLoggedInUser->pendingSentFriendRequests()->attach($receiverId);


        return response()->json(['id' => $receiverId]);
    }

    public function sendFriendRequestFromUserProfile(Request $request) {
        // this ID belongs to the user we are sending the friend request to.
        $userId = $request->user_id;

        // Current logged in user.
        $loggedInUser = auth()->user();

        // Creating record to friend_requests table.
        $loggedInUser->pendingSentFriendRequests()->attach($userId);

        return back();
    }

    public function getAllFriendRequests() {
        $user = auth()->user();

        $data = $user->pendingSentFriendRequests()->get();

        return response()->json(['response' => $data]);
    }

    public function getFriendRequestStatusSpecificUser(User $user) {

        $loggedInUser = auth()->user();

        $sent = $loggedInUser->pendingSentFriendRequests()->where('receiver_id', $user->id)->first();

        if ($sent) {
            return response()->json(['success' => true]);
        } else {
            return response()->json(['success' => false]);
        }
    }

    public function cancelFriendRequest(User $user) {
        $loggedInUser = auth()->user();

        $loggedInUser->pendingSentFriendRequests()->detach($user->id);

        return response()->json(['success' => true]);
    }

    public function cancelFriendRequestFromUserProfile(Request $request) {
        $userId = $request->user_id;

        $loggedInUser = auth()->user();

        $loggedInUser->pendingSentFriendRequests()->detach($userId);

        return back();
    }

    public function getReceivedFriendRequests(Request $request) {
        $loggedInUser = auth()->user();

        $response = $loggedInUser->pendingReceivedFriendRequest()->paginate(10);

        $mappedResponse = $response->map(function ($user) {
            if ($user->profile_pic_path == 'none') {
                $user->profile_pic_s3_url = NULL;
            } else {
                $user->profile_pic_s3_url = Storage::disk('s3')->url('images/other_images/' . $user->profile_pic_path);
            }

            return $user;
        });

        return response()->json(['success' => true, 'response' => $mappedResponse, 'lastPage' => $response->lastPage()]);
    }

    // this function is called when displaying people (all users) in the people section. This is useful to know which button to display for that user.
    // If this function returns true then it means the user that will be displayed, has sent us a friend request therefore we must display a button that 
    // either accepts the request or rejects it.
    public function haveIReceivedaFriendRequestFromSpecificUser(User $user) {
        $loggedInUser = auth()->user();

        $flag = $loggedInUser->pendingReceivedFriendRequest()->where('sender_id', $user->id)->first();

        if ($flag) {
            return response()->json(['success' => true]);
        } else {
            return response()->json(['success' => false]);
        }
    }

    public function deleteFriendRequest(Request $request) {
        $jsonData = $request->json()->all();

        $userId = $jsonData['id'];

        $loggedInUser = auth()->user();

        $loggedInUser->pendingReceivedFriendRequest()->detach($userId);

        return response()->json(['success' => true]);
    }

    public function acceptFriendRequest(Request $request) {
        $json = $request->json()->all();

        $userToBeFriend = User::findOrFail($json['id']);
        $userId = $userToBeFriend->id;


        $loggedInUser = auth()->user();

        // Creating friend relationship by adding new record to pivot table.
        $loggedInUser->friends()->attach($userId);
        $userToBeFriend->friends()->attach($loggedInUser);

        // Deleting pending friend request.
        $loggedInUser->pendingReceivedFriendRequest()->detach($userId);

        return response()->json(['success' => true]);
    }

    public function areWeFriendsAlready(User $user) {
        $flag = false;
        
        $loggedInUser = auth()->user();
    
        // checking to see if logged in user and the user obtain thru laravel route model binding are friends.
        if ($loggedInUser->friends()->where('users.id', '=', $user->id)->exists() && $user->friends()->where('users.id', '=', $loggedInUser->id)) {
            $flag = true;
        }

        if ($flag) {
            return response()->json(['success' => true]);
        } else {
            return response()->json(['success' => false]);
        }
    }

    public function getMyFriends() {
        $loggedInUser = auth()->user();

        $allFriends = $loggedInUser->friends()->paginate(5);

        // Here we map friends so that we can add an extra attribute to each friend object.
        // This object contains the user's profile pic s3 URL (if the user has a profile pic in the first place).
        $mappedFriends = $allFriends->map(function ($friend) {
            if ($friend->profile_pic_path == 'none') {
                $friend->profile_pic_s3_url = NULL;
            } else {
                $friend->profile_pic_s3_url = Storage::disk('s3')->url('images/other_images/' . $friend->profile_pic_path);
            }

            return $friend;
        });

        return response()->json(['friends' => $mappedFriends, 'lastPage' => $allFriends->lastPage()]);
    }

    public function deleteFriend(Request $request) {
        $json = $request->json()->all();

        $userToDelete = User::findOrFail($json['id']);
        $loggedInUser = auth()->user();
        
        // Detach both records.
        $userToDelete->friends()->detach($loggedInUser->id);
        $loggedInUser->friends()->detach($userToDelete->id);

        return response()->json([
            'success' => true
        ]);

    }


    public function checkoutOtherUser(User $user) {

        // Since displaying this user's posts will be required.
        $posts = $user->posts()->orderBy('created_at', 'desc')->paginate(5);
        
        // Sending data to HTTP session.
        return view('home.other-user-profile-page', ['user' => $user, 'posts' => $posts]);
    }


    public function unfriendUser(Request $request) {

        // Authenticated user object.
        $loggedInUser = auth()->user();

        // Other user object (user we are checking out profile for).
        $otherUser = User::findOrFail($request->user_id);


        // Removing many-2-many relationship.
        $loggedInUser->friends()->detach($otherUser->id);
        $otherUser->friends()->detach($loggedInUser->id);

        // Redicrecting user back to user page.
        return back();
    }
}
