<?php

namespace App\Http\Controllers;
use App\Models\User;

use Illuminate\Http\Request;

class PeopleController extends Controller
{
    function getPeople(Request $request) {

        $people = User::where('id', '!=', auth()->user()->id)->get();

        return response()->json(['people' => $people]);
    }
}
