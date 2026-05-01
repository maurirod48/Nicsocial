@extends('home.home-layout')


@section('content')


<div class="home-main-container">
    <div class="home-middle-section-container">
        <div class="feed-tabs-wrapper">
            <label for="global" class="feed-tab">
                <h1>Public</h1>
                <input type="radio" id="global" name="hh" class="feed-tab-radio" checked>
                <span class="public-tab-bottom-line"></span>
            </label>
            <label for="friends-only" class="feed-tab">
                <h1>Friends</h1>
                <input type="radio" id="friends-only" name="hh" class="feed-tab-radio">
                <span class="friends-tab-bottom-line"></span>
            </label>
        </div>
        <div class="dynamic-feed-section">
            {{-- JS inserts posts here dynamically depending on the seletec tab --}}
        </div>
    </div>
</div>


@endsection