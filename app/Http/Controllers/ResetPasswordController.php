<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;

class ResetPasswordController extends Controller
{
    //

    public function create($token) {
        return view('auth.reset-password', ['token' => $token]);
    }

    public function store(Request $request) {
        $input = $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|confirmed'
        ]);

        $status = Password::reset(
            $request->only('email', 'token', 'password'),
            function (User $user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ]);
                
                $user->save();
        });

        return $status == Password::PASSWORD_RESET ? back()->with('success', __($status)) : back()->with('error', __($status));
    }
}
