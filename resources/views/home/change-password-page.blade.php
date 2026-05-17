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
        <form action="{{ route('change.password') }}" method="POST">
            @csrf
            <div class="change-password-form-container">
                <div>
                    <input type="text" name="current_password" class="password-input" placeholder="Current password">
                    <a href="" class="forgot-password-link"><p>Forgot password?</p></a>
                </div>
                <hr>
                <input type="text" name="new_password" class="password-input new-password-input" placeholder="New password">
                <input type="text" name="new_password_confirmation" class="password-input new-password-input" placeholder="Confirm password">
                <hr style="margin: 1.5rem 0">
                <div class="save-btn-container">
                    <button class="save-new-password-btn">Save</button>
                </div>
            </div>
        </form>
        @session('message')
            <div class="errors-wrapper">
                <div class="errors-container">
                    <h3>{{ session('message') }}</h3>
                    <div class="errors-ok-btn-wrapper">
                        <button class="errors-ok-btn">Ok</button>
                    </div>
                </div>
            </div
        @endsession

        @if ($errors->any())
            <div class="errors-wrapper">
                <div class="errors-container">
                    <h1>Something went wrong</h1>
                    @foreach ($errors->all() as $error)
                        <h2>{{ $error }}</h2>
                    @endforeach

                    <div class="errors-ok-btn-wrapper">
                        <button class="errors-ok-btn">Ok</button>
                    </div>
                </div>
            </div>
        @endif

    </div>
</div>

@endsection