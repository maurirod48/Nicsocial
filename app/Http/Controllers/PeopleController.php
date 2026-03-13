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

    public function friendRequest(Request $request) {
        $json = $request->json()->all();

        $currentLoggedInUser = auth()->user();

        $senderId = $currentLoggedInUser->id;
        $receiverId = $json['id'];

        $currentLoggedInUser->pendingSentFriendRequests()->attach($receiverId);


        return response()->json(['id' => $receiverId]);
    }
}
