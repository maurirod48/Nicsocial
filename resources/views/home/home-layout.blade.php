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
        <nav class="nav-bar">

            <div class="nav-section-1">
                
                <div class="logo-container">
                    <img src="{{ asset('storage/website_logo_images/Nicsocial logo - White.png') }}" alt="nicsocial logo"
                    class="logo-img-home-layout">

                    {{-- <img src="{{ asset('images/default-images/elden_ring_logo2.png')}}" alt="elden ring logo"
                    class="elden-ring-logo"> --}}
                </div>

                {{-- <div class="nav-name-email">
                        <h1 class="nav-name">{{auth()->user()->name}}</h1>
                        <p class="nav-email">{{auth()->user()->email}}</p>
                    </div> --}}
            </div>
            

            <ul class="nav-options">
                <li><a href="{{route('home.section')}}">
                    <img src="{{ asset('storage/website_images/home1.png') }}" alt="home image" class="nav-bar-icon"
                    title="home">
                </a>
                </li>
                <li>
                    <a href="{{route('people.section')}}">
                        <img src="{{ asset('storage/website_images/people.png') }}" alt="profile image" class="nav-bar-icon"
                        title="people">
                    </a>
                </li>
                <li>
                    <a href="{{route('profile.section')}}">
                        <img src="{{ asset('storage/website_images/user.png') }}" alt="profile image" class="nav-bar-icon" 
                        title="profile">
                    </a>
                </li>
                <li>
                    <a href="#settings">
                        <img src="{{ asset('storage/website_images/setting.png') }}" alt="profile image" class="nav-bar-icon"
                        title="settings">
                    </a>
                </li>
                <li class="logout-btn" style="cursor: pointer;">
                    <img src="{{ asset('storage/website_images/logout.png') }}" alt="profile image" class="nav-bar-icon"
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
        
    </div>
    
</body>
</html>