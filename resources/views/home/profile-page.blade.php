@extends('home.home-layout')



@section('content')

<meta name="current-loggedIn-username" content="{{auth()->user()->name}}">
<meta name="current-loggedIn-email" content="{{auth()->user()->email}}">

<div class="profile-section-wrapper">
    <div class="profile-card-wrapper">
        <div class="banner-img-container">
            <img src="{{ asset("images/default-images/default_banner.jpeg") }}" alt="default banner image"
            class="default-banner-image">
            <div class="profile-pic-container">
                @if(auth()->user()->gender === 'male' && auth()->user()->profile_pic_path == 'none')
                    <img src="{{asset('images/default-images/male-pic.jpg')}}" alt="default male profile pic"
                class="default-male-profile-pic">
                @elseif (auth()->user()->gender === 'female' && auth()->user()->profile_pic_path == 'none')
                    <img src="{{asset('images/default-images/female-pic.jpeg')}}" alt="SOME PIC" class="default-female-profile-pic">
                @else
                    <img src="{{asset('storage/images/other_images/' . auth()->user()->profile_pic_path)}}" alt="actual profile pic" class="default-female-profile-pic">
                @endif

                <button class="change-pic-btn">Change picture</button>
            </div>
        </div>


        <section class="profile-card-information">
            <div class="edit-profile-btn-wrapper">
                <button class="edit-profile-btn">Edit profile</button>
            </div>

            <div class="user-basic-info-wrapper">
                <div class="user-username">{{Auth::user()->name}}</div>
                <div class="user-email">{{Auth::user()->email}}</div>
                <div class="user-id">ID: {{ Auth()->user()->id }}</div>

                <div class="user-bio">
                    @if (Auth::user()->bio === NULL)
                        Not much to say for this user...
                    @else
                        {{Auth::user()->bio}}
                    @endif                
                </div>

                <div style="display:flex; gap: .5rem; align-items: center;">
                    <img src="{{asset('images/default-images/calendar-icon.png')}}" alt="little calendar icon"
                    class="little-calendar-icon">
                    <div class="join-date">Joined {{Auth::user()->created_at_date()}}</div>
                </div>
            </div>

            <div class="most-errors-wrapper">
                @error('new-pic')
                    <p>{{ $message }}</p>
                @enderror
            </div>

            <div class="post-btn-wrapper">
                <button class="post-btn post-btn-flex">Post</button>
                @if(session('success'))
                    <h3>{{session('success')}}</h3>
                @endif
                @error('title')
                    <h3 class="error">Error: {{$message}}</h3>
                @enderror
                @error('description')
                    <h3 class="error">Error: {{$message}}</h3>
                @enderror
            </div>

            {{-- POSTs SECTION (where all posts will be displayed one by one)--}}
            <section class="posts-section">
                @foreach ( $posts as $post)

                    <div class="post-container">
                        <input type="hidden" class="post-id" value="{{ $post->id }}">

                        @if ($post->user_id === auth()->user()->id)
                            <div class="post-header user-owns-this-post" style="display: flex; gap: .5rem; align-items: center;">
                                <div>
                                    <p class="post-username">{{ auth()->user()->name }}</p>
                                    <p class="post-email">{{ auth()->user()->email }}</p>
                                </div>
                                
                                <div class="post-options-container">
                                    <img src="{{ asset('storage/website_images/three_dots.png') }}" alt="post-options-image"
                                    class="post-options-image">

                                    <div class="post-options-dropdown-wrapper">
                                        <div class="post-options-dropdown">
                                            <span class="delete-post-btn">Delete</span>
                                            <span class="edit-post-btn">Edit</span>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        @endif
                        

                        <p class="post-title">{{ $post->title }}</p>

                        <p class="post-description">{{ $post->description}}</p>

                        @if ($post->image)
                            <img src="{{ asset('storage/images/post_images/' . $post->image) }}" alt="post image" class="post-image">
                        @endif

                        <div class="post-footer">
                            <div class="post-action-buttons" style="display: flex; gap: .5rem;">
                                @if (Auth()->user()->likedPosts()->where('post_id', $post->id)->exists())
                                    <img src="{{ asset('storage/website_images/liked.png') }}" alt="liked icond" class="like-btn-img">
                                @else
                                    <img src="images/default-images/like_btn.png" alt="like button image" class="like-btn-img">
                                @endif

                                @if (Auth()->user()->dislikedPosts()->where('post_id', $post->id)->exists())
                                    <img src="{{ asset('storage/website_images/dislike.png') }}" alt="liked icond" class="dislike-btn-img">
                                @else
                                    <img src="images/default-images/dislike_btn.png" alt="like button image" class="dislike-btn-img">
                                @endif
                                
                                <img src="images/default-images/share_btn.png" alt="like button image" class="share-btn-img">
                            </div>

                            <div class="post-stats" style="display: flex; gap: .5rem;">
                                <p>likes {{$post->likes}}</p>
                                <p>dislikes {{$post->dislikes}}</p>
                                <p>shared {{ $post->times_shared }}</p>
                            </div>

                        </div> 
                    </div>
                @endforeach
            </section>

            {{-- This popup will show up when user wants to create a post, therefor it is not displayed by  default --}}
            <div class="post-form-popup-wrapper">
                <div class="post-form-popup-wrap">
                    <h1 style="margin: 0;">Create Post</h1>
                    <form action="{{route('post.create')}}" method="POST" enctype="multipart/form-data">                        
                        @csrf
                        {{-- post form --}}
                        <div class="post-form">
                            <div class="post-form-field">
                                <label for="title">Title</label> <br>
                                <input type="text" id="title" name="title">
                            </div>

                            <div class="post-form-field">
                                <label for="desc">Description</label> <br>
                                <textarea name="description" id="desc">Enter a description</textarea>
                            </div>

                            <div class="post-form-field">
                                <label for="upload-img">
                                    <img src="{{ asset('storage/website_images/upload_pic_icon.png') }}" alt="upload pic icon" class="upload-pic-img">
                                </label>

                                <input type="file" name="postPic" id="upload-img" style="display: none;">

                                {{-- <p class="check-btn">check</p> --}}
                            </div>

                            <div class="current-selected-pic-container">
                                {{-- current selected pic to upload goes here, this will be displayed using JS --}}
                                <img src="" class="preview-image-post">
                                <span class="remove-post-pic-btn">X</span>
                            </div>

                            <div class="post-form-btn-wrapper">
                                <button class="post-btn">Post</button>
                                <button class="post-cancel-btn" type="button">Cancel</button>
                            </div>
                            
                        </div>
                    </form>
                </div>
            </div>
        </section>
    </div>

    <div class="edit-post-popup-wrapper">
        <div class="edit-post-popup">
            <h1>Edit post</h1>
            <form action="{{ route('post.edit') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <div class="edit-post-form">

                        <input type="hidden" class="edit-post-id" name="edit-post-id">
                        <input type="text" class="edit-post-title-input" name="edit-post-title-input">
                        <br>
                        <textarea class="edit-post-desc-input" name="edit-post-desc-input"></textarea>
                        <br>
                        <img src="" class="edit-post-img">
                        <div>
                            <label for="optional-img-input" id="update-pic-btn">Update this pic</label>
                            <input type='file' class="optional-img-input" id="optional-img-input" style="display: none;">                
                        </div>
                        <button>Update</button>
                        <button type="button" class="cancel-btn-edit-post">Cancel</button>
                </div>

            
            </form>
        </div>
    </div>

    <div class="popup-delete-post-wrapper">
        <div class="popup-delete-post-wrap">
            <h1>Delete this post?</h1>
            <div class="delete-post-yes-no-btn-wrapper">
                <button class="delete-post-btn-yes">yes</button>
                <button class="delete-post-btn-no">No</button>
            </div>
        </div>
    </div>

    {{-- Popup for then user wants to change profile picture --}}
    <div class="change-profile-pic-popup-wrapper">
        <div class="change-profile-pic-popup-wrap">
            <h1 style="color:rgb(33, 94, 228)">Edit profile picture</h1>
            
            <form action="{{ route('change.profile.pic') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <div class="upload-profile-pic-form-wrapper">
                    <label>Upload picture here</label>
                    <br>
                    <input type="file" name="new-pic" id="new-profile-pic" class="new-pic">
                </div>
                <div class="new-profile-pic-preview-container">
                    <img src="" class="preview-profile-pic">
                </div>
                <button type="submit">Update</button>
                <button class="change-pic-cancel-btn" type="button">cancel</button>
                
            </form>

            <div class="change-pic-error-wrapper">
                <div class="change-pic-error">

                    <p>Please select an image</p>

                    <div class="change-pic-error-btn" style="display: flex; justify-content: center;">
                        <button class="change-pic-error-ok-btn">ok</button>
                    </div>
                </div>
            </div>
        </div>

        
    </div>

    {{-- Popup to update info profile --}}
    <div class="edit-profile-popup-wrapper">
        <div class="edit-profile-popup-wrap">
            <h1 style="color:rgb(33, 94, 228)">Edit profile</h1>
            <form action="{{ route('profile.edit') }}" method="POST">
                @csrf
                <div class="edit-profile-form-wrapper">
                    <div class="edit-profile-form-input-container">
                        <label for="edit-name" class="edit-profile-label">Name</label>
                        <br>
                        <input type="text" name="name" id="edit-name" value="{{ auth()->user()->name }}">
                    </div>
                    
                    <div class="edit-profile-form-input-container">
                        <label for="edit-email" class="edit-profile-label">Email</label>
                        <br>
                        <input type="text" name="email" id="edit-email" value="{{ auth()->user()->email }}">
                    </div>

                    <div class="edit-profile-form-input-container">
                        <label for="edit-bio" class="edit-profile-label">Bio</label>
                        <br>
                        <textarea name="bio" id="edit-bio" class="bio-textarea">{{ auth()->user()->bio }}</textarea>
                    </div>
                    
                    <div class="edit-profile-form-input-container">
                        <label for="edit-gender" class="edit-profile-label">Gender</label>
                        <br>
                        <select name="gender" id="edit-gender" >
                            <option value="male">male</option>
                            <option value="female">female</option>
                        </select>
                    </div>

                    <div>
                        <button class="edit-profile-form-save-btn">
                            Save
                        </button>
                        <button class="edit-profile-form-cancel-btn" type="button">
                            Cancel
                        </button>
                    </div>
                    
                </div>
            </form>
        </div>
    </div>

    {{-- This popup here will appear when there are errors when trying to update profile info --}}
    @if($errors->editProfileErrors->any())
        <div class="edit-profile-errors-popup-wrapper show">
            <div class="edit-profile-errors-popup-wrap">
                <h1>Something went wrong:</h1>

                @foreach ($errors->editProfileErrors->all() as $error)
                    <p class="error">{{ $error }}</p>
                @endforeach

                <div class="edit-profile-errors-ok-btn-wrapper">
                    <button class="edit-profile-errors-ok-btn">Ok</button>
                </div>
            </div>
        </div>
    @enderror


</div>



@endsection