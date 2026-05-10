@extends('home.home-layout')



@section('content')


<div class="other-profile-section-wrapper">
    <div class="other-profile-section-container">
        {{-- header --}}
        <div class="default-banner-img-container">
            <img src="{{ asset('images/default-images/default_banner.jpeg') }}" alt="default banner image"
            class="default-banner-image">

            @if ($user->profile_pic_path == 'none' && $user->gender == 'male')
                <img src="{{ asset('images/default-images/male-pic.jpg') }}" class="user-profile-pic">
            @elseif ($user->profile_pic_path == 'none' && $user->gender == 'female')
                <img src="{{ asset('images/default-images/female-pic.jpeg') }}" class="user-profile-pic">
            @else
                <img src="{{ Storage::disk('s3')->url('images/other_images/' . $user->profile_pic_path) }}" class="user-profile-pic">
            @endif
            
        </div>
        
        <div class="user-profile-body-container">
            {{-- body header --}}
            <div class="profile-body-header-container">
                <button class="friend-request-btn">Send friend request</button>
            </div>
            {{-- user profile info/description --}}
            <div class="user-info-container">
                {{-- email & username --}}
                <div class="user-name-email-container">
                    <h2 class="user-name">{{ $user->name }}</h2>
                    <p class="user-email">{{ $user->email }}</p>
                </div>
                
                {{-- user bio --}}
                <div class="user-bio-container">
                    @if (!$user->bio)
                        <p>Not much to say for this user...</p>
                    @else
                        <p>{{ $user->bio }}</p>
                    @endif
                    
                </div>

                <div class="join-date-container">
                    <img src="{{ asset('images/default-images/calendar-icon.png') }}" alt="calendar icon"
                    class="calendar-icon">
                    <h3 class="join-date">Joined {{ $user->created_at_date() }}</h3>
                </div>
            </div>
        </div>

        {{-- POSTS GO HERE --}}
        <div class="posts-container">

        </div>
    </div>
</div>


@endsection