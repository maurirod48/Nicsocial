<?php

namespace App\Http\Controllers;
use App\Models\User;

use Illuminate\Http\Request;

class PeopleController extends Controller
{
    public function getPeople(Request $request) {

        $people = User::where('id', '!=', auth()->user()->id)->get();

        return response()->json(['people' => $people]);
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

    public function getReceivedFriendRequests() {
        $loggedInUser = auth()->user();

        $response = $loggedInUser->pendingReceivedFriendRequest()->get();

        return response()->json(['success' => true, 'response' => $response]);
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

        $allFriends = $loggedInUser->friends()->get();

        return response()->json(['friends' => $allFriends]);
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
}
