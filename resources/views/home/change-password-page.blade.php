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

        {{-- LOGGED IN USER INFO --}}
        <div class="user-info-container">
            @if (auth()->user()->profile_pic_path == 'none' && auth()->user()->gender == 'male')
                <img src="{{ asset('images/default-images/male-pic.jpg') }}" alt="user profile pic"
                class="user-profile-pic">
            @elseif (auth()->user()->profile_pic_path == 'none' && auth()->user()->gender == 'female')
                <img src="{{ asset('images/default-images/female-pic.jpeg') }}" alt="user profile pic"
                class="user-profile-pic">
            @else
                <img src="{{ Storage::disk('s3')->url('images/other_images/' . auth()->user()->profile_pic_path) }}" alt="user profile pic"
                class="user-profile-pic">
            @endif
            <h2>{{ auth()->user()->name }}</h2>
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