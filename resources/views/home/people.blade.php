@extends('home.home-layout')

@section('content')

<div class="people-section-container">

    <div class="middle-center">
        <div class="friends-people-tab-wrapper">
            <label for="friends-radio" class="friends-tab tabb">
                <h1>Friends</h1>
                <input type="radio" name="tab-radio" id="friends-radio" checked> {{-- Radio to check which tab is currently being selected --}}
                <span class="blue-line-under-friends-tab"></span>
            </label>
            <label for="people-radio" class="people-tab tabb">
                <h1>More people</h1>
                <input type="radio" name="tab-radio" id="people-radio"> {{-- Radio to check which tab is currently being selected --}}
                <span class="blue-line-under-people-tab"></span>
            </label>
            <label for="requests-radio" class="requests-tab tabb">
                <h1>Friend requests</h1>
                <input type="radio" name="tab-radio" id="requests-radio"> {{-- Radio to check which tab is currently being selected --}}
                <span class="blue-line-under-requests-tab"></span>
            </label>
        </div>

        <div class="dynamic-section">
            {{-- This will be dynamically changed using JS. here we'll show friends, users, friend requests. --}}
        </div>
    </div>

    {{-- Pop up for when user tries to unfriend a user --}}
    <div class="confirm-unfriend-popup-wrapper">
        <div class="confirm-unfriend-popup-wrap">
            <h1 class="confirm-unfriend-popup-text"></h1>
            <div class="confirm-unfriend-button-wrapper">
                <button class="unfriend-yes-btn unfriend-btn">yes</button>
                <button class="unfriend-no-btn unfriend-btn">no</button>
            </div>
        </div>
    </div>
</div>

@endsection
