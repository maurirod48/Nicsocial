<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;


class ForgotPasswordController extends Controller
{

    public function create() {
        return view('auth.forgot-password');
    }

    public function store(Request $request) {
        $input = $request->validate([
            'email' => 'email|required'
        ]);


        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT 
        ? redirect()->back()->with('success', __($status)) 
        : redirect()->back()->withErrors(['email' => __($status)]);
    }
}
