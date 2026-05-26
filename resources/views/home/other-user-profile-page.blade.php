@extends('home.home-layout')



@section('content')

{{-- ID of the user we are checking out --}}
<meta name="loggedin-user-id" content="{{ $user->id }}">

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
                @if (auth()->user()->friends()->where('friend', '=', $user->id)->exists())
                    <form action="{{ route('unfriend-user') }}" method="POST">
                        @csrf
                        <input type="hidden" name="user_id" class="user-id" value="{{ $user->id }}">
                        <button class="unfriend-btn">Unfriend</button>
                    </form>
                @elseif (auth()->user()->pendingSentFriendRequests()->where('receiver_id', '=', $user->id)->exists())
                    <form action="{{ route('cancel-friend-request') }}" method="POST">
                        @csrf
                        <input type="hidden" name="user_id" class="user-id" value="{{ $user->id }}">
                        <button class="cancel-friend-request-btn">Cancel request</button>
                    </form>
                @elseif (auth()->user()->pendingReceivedFriendRequest()->where('sender_id', $user->id)->exists())
                    <div class="accept-delete-btns-container">
                        <form action="{{ route('accept.friend.request') }}" method="POST">
                            <input type="hidden" name="user_id" class="user-id" value="{{ $user->id }}">
                            @csrf
                            <button class="accept-friend-request-btn">Accept request</button>
                        </form>
                        <form action="{{ route('delete.friend.request') }}" method="POST">
                            @csrf
                            <input type="hidden" name="user_id" class="user-id" value="{{ $user->id }}">
                            <button class="delete-friend-request-btn">delete request</button>
                        </form>
                    </div>
                @else
                    <form action="{{ route('send-friend-request') }}" method="POST">
                        @csrf
                        <input type="hidden" name="user_id" class="user-id" value="{{ $user->id }}">
                        <button class="friend-request-btn">Send friend request</button>
                    </form>
                @endif
                
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



        <h1 style="margin-left:1rem; font-size: 2rem; padding: .5rem;">Posts</h1>
        {{-- POSTS GO HERE --}}
        <div class="posts-container">
            @foreach ($posts as $post)
                <div class="post-container">
                    <input type="hidden" name="post_id" class="post-id" value="{{ $post->id }}">
                    {{-- post header --}}
                    <div class="post-header">
                        <div class="post-user-info">
                            <div class="post-user-profile-container">
                                {{-- dynamic profile picture --}}
                                @if ($user->profile_pic_path == 'none' && $user->gender == 'male')
                                    <img src="{{ asset('images/default-images/male-pic.jpg') }}" class="post-user-profile-pic">
                                @elseif ($user->profile_pic_path == 'none' && $user->gender == 'female')
                                    <img src="{{ asset('images/default-images/female-pic.jpeg') }}" class="post-user-profile-pic">
                                @else
                                    <img src="{{ Storage::disk('s3')->url('images/other_images/' . $user->profile_pic_path) }}" class="post-user-profile-pic">
                                @endif
                            </div>

                            <div class="post-username-email">
                                <h2 class="user-name">{{ $user->name }}</h2>
                                {{-- <p class="user-email">{{ $user->email }}</p> --}}
                            </div>
                        </div>
                    </div>
                    {{-- post body --}}
                    <div class="post-body">
                        <div class="post-title-description-container">
                            <h1 class="post-title">{{ $post->title }}</h1>
                            <p class="post-description">{{ $post->description }}</p>
                        </div>

                        @if($post->file_name)
                            @if (str_contains($post->file_type, 'image/') || $post->file_type == NULL)
                                <img src="{{ Storage::disk('s3')->url('images/post_images/' . $post->file_name) }}" alt="post image"
                                class="post-img">
                            
                            @else
                                <video src="{{ Storage::disk('s3')->url('videos/post_videos/' . $post->file_name) }}" controls
                                class="post-video"></video>
                            @endif
                        @endif
                    </div>
                    {{-- post footer --}}
                    <div class="post-footer">
                        <div class="post-footer-reaction-btns-container">
                            
                            {{-- like button --}}
                            @if ($post->likedByUser()->where('user_id', '=', auth()->user()->id)->exists())
                                <img src="{{ asset('images/website_images/liked.png') }}" alt="like button" class="like-btn post-reaction-btn">
                            @else
                                <img src="{{ asset('images/default-images/like_btn.png') }}" alt="like button" class="like-btn post-reaction-btn">
                            @endif

                            {{-- dislike button --}}
                            @if ($post->dislikedByUser()->where('user_id', '=', auth()->user()->id)->exists())
                                <img src="{{ asset('images/website_images/dislike.png') }}" alt="dislike button" class="dislike-btn post-reaction-btn">
                            @else
                                <img src="{{ asset('images/default-images/dislike_btn.png') }}" alt="dislike button" class="dislike-btn post-reaction-btn">
                            @endif
                        </div>
                        <div class="post-stats-container">
                            <p> likes {{ $post->likes }}</p>
                            <p> dislikes {{$post->dislikes}}</p>
                        </div>  
                    </div>
                </div>
            @endforeach
            

            @if (count($posts) < 1)
                <div class="no-posts-message-container">
                    <h2>Nothing to show here yet.</h2>
                </div>
            @endif
        </div>
        {{ $posts->links() }}
    </div>
</div>


@endsection