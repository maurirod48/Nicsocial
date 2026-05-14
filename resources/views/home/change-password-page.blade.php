@extends('home.home-layout')

@section('content')

<div class="change-password-section-wrapper">
    <div class="change-password-section-container">
        {{-- HEADER --}}
        <div class="change-password-header">
            <a href="{{ route('settings.section') }}" class="go-back-btn">
                <svg class="back-arrow-btn" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </a>
            <h1>Change Password</h1>
        </div>

        {{-- CHANGE PASSWORD FORM --}}
        <form action="">
            <div class="change-password-form-container">
                <label for="password">Password</label>
                <input type="text" name="password" class="password" id="password">
            </div>
        </form>
    </div>
</div>

@endsection