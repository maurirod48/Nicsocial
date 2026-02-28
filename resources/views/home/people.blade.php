@extends('home.home-layout')

@section('content')

<div class="people-section-container">

    <div class="middle-center">
        <div class="friends-people-tab-wrapper">
            <label for="friends-radio" class="friends-tab">
                <h1>Friends</h1>
                <input type="radio" name="tab-radio" id="friends-radio">
            </label>
            <label for="people-radio" class="people-tab">
                <h1>More people</h1>
                <input type="radio" name="tab-radio" id="people-radio">
            </label>
        </div>
    </div>
</div>

@endsection
