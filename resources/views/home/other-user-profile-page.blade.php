@extends('home.home-layout')



@section('content')


<div class="other-profile-section-wrapper">
    <div class="other-profile-section-container">
        <div class="default-banner-img-container">
            <img src="{{ asset('images/default-images/default_banner.jpeg') }}" alt="default banner image"
            class="default-banner-image">
            <img src="{{ Storage::disk('s3')->url('images/other_images/' . $user->profile_pic_path) }}" class="user-profile-pic">
        </div>
    </div>
</div>


@endsection