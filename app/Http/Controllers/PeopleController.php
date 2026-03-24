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
}
