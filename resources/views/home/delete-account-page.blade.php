@extends('home.home-layout')

@section('content')
    
    <div class="delete-account-section-wrapper">
        <div class="delete-account-section-container">
            {{-- HEADER --}}
            <div class="delete-account-header">
                <svg class="back-arrow-btn" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                <h1>Delete account</h1>
            </div>

            {{-- LOGGED IN USER INFO --}}
            <div class="user-info-container">
                <img src="{{ Storage::disk('s3')->url('images/other_images/' . auth()->user()->profile_pic_path) }}" alt="user profile pic"
                class="user-profile-pic">
                <h2>{{ auth()->user()->name }}</h2>
            </div>

            <div class="text-info-container">
                <h2>This will delete your account</h2>
                <p>You’re about to start the process of deleting your Nicsocial account. Your display name and public profile will no longer be viewable on Nicsocial</p>
                <div class="delete-btn-dropdown-container">
                    <div class="delete-btn-container">
                        <button class="delete-account-btn">Delete</button>
                    </div>
                    <div class="delete-dropdown-container">
                        <h3 style="margin:0; margin-bottom: .5rem;">Confirm action</h3>
                        <button class="btn">Confirm</button>
                        <button class="btn cancel-btn">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection