@extends('home.home-layout')

@section('content')

<div class="people-section-container">

    <div class="middle-center">
        <div class="friends-people-tab-wrapper">
            <label for="friends-radio" class="friends-tab">
                <h1>Friends</h1>
                <input type="radio" name="tab-radio" id="friends-radio" checked> {{-- Radio to check which tab is currently being selected --}}
                <span class="blue-line-under-friends-tab"></span>
            </label>
            <label for="people-radio" class="people-tab">
                <h1>More people</h1>
                <input type="radio" name="tab-radio" id="people-radio"> {{-- Radio to check which tab is currently being selected --}}
                <span class="blue-line-under-people-tab"></span>
            </label>
        </div>

        <div class="dynamic-section">
            {{-- This will be dynamically changed using JS. --}}
        </div>
    </div>
</div>

@endsection
