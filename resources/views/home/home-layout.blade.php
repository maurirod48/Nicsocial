<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Home Page</title>
    @vite('resources/js/app.js')
</head>
<body class="home-page">

    <div class="body-main">
        {{-- Navigation bar --}}
        <nav class="nav-bar">

            <div class="nav-section-1">
                
                <div class="logo-container">
                    <img src="{{ asset('images/website_logo_images/Nicsocial logo - White.png') }}" alt="nicsocial logo"
                    class="logo-img-home-layout">

                    <h2 style="font-weight:100;">Welcome {{ auth()->user()->name }}!</h2>
                </div>
            </div>
            

            <ul class="nav-options">
                <li><a href="{{route('home.section')}}">
                    <img src="{{ asset('images/website_images/home1.png') }}" alt="home image" class="nav-bar-icon"
                    title="home">
                </a>
                </li>
                <li>
                    <a href="{{route('people.section')}}">
                        <img src="{{ asset('images/website_images/people.png') }}" alt="profile image" class="nav-bar-icon"
                        title="people">
                    </a>
                </li>
                <li>
                    <a href="{{route('profile.section')}}">
                        <img src="{{ asset('images/website_images/user.png') }}" alt="profile image" class="nav-bar-icon" 
                        title="profile">
                    </a>
                </li>
                <li>
                    <a href="#settings">
                        <img src="{{ asset('images/website_images/setting.png') }}" alt="profile image" class="nav-bar-icon"
                        title="settings">
                    </a>
                </li>
                <li class="logout-btn" style="cursor: pointer;">
                    <img src="{{ asset('images/website_images/logout.png') }}" alt="profile image" class="nav-bar-icon"
                    title="logout">
                </li>
            </ul>
        </nav>

        <div class="logout-popup-wrapper">
            <div class="logout-popup-wrap">
                Log out?
                <div class="logout-options-wrapper">
                    <form action="{{route('user.logout')}}" method="POST">
                        @csrf
                        <button class="logout-opt logout-opt-yes">Yes</button>
                    </form>

                    <button class="logout-opt logout-opt-no">No</button>
                </div>
            </div>
        </div>

        {{-- Page content goes here --}}
        @yield('content')
        


        {{-- bottom bar --}}
        <nav class="bottom-nav-bar">
            <a href="{{route('home.section')}}">
                <img src="{{ asset('images/website_images/home1.png') }}" alt="home" class="bottom-nav-icon" title="home">
            </a>
            <a href="{{route('people.section')}}">
                <img src="{{ asset('images/website_images/people.png') }}" alt="people" class="bottom-nav-icon" title="people">
            </a>
            <a href="{{route('profile.section')}}">
                <img src="{{ asset('images/website_images/user.png') }}" alt="profile" class="bottom-nav-icon" title="profile">
            </a>
            <a href="#settings">
                <img src="{{ asset('images/website_images/setting.png') }}" alt="settings" class="bottom-nav-icon" title="settings">
            </a>
            <span class="logout-btn">
                <img src="{{ asset('images/website_images/logout.png') }}" alt="logout" class="bottom-nav-icon" title="logout">
            </span>
        </nav>
    </div>
    
</body>
</html>