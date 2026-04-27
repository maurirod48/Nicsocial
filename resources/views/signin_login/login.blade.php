<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MDM Login</title>
    @vite('resources/js/app.js')
</head>
<body class="login-page">

    <div class="main-wrapper">

        <img src="{{ asset('images/website_logo_images/Nicsocial logo - White.png') }}" alt="nicsocial logo"
        class="logo-img">

        <div class="main-wrap">
            <h1>Log In</h1>
            <form action="{{route('user.login')}}" method="POST">
                @csrf
                <div class="login-form">
                    <input type="text" placeholder="Username" required name="name">

                    <input type="password" placeholder="Password" required name="password">

                    <button class="login-btn">Log In</button>

                    <p>
                        <a href="{{route('signin.page')}}">Don't have an account?</a>
                    </p>
                    <p>
                        <a href="{{route('password.request')}}">Forgot password?</a>
                    </p>
                </div>
            </form>
        </div>
        @if ($errors->any())
            @foreach ($errors->all() as $error)
                <p>{{$error}}</p>
            @endforeach
        @endif
        @if(session('message'))
            <h1>{{ session('message') }}</h1>
        @endif
    </div>
</body>
</html>