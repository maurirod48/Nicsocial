<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Nicsocial</title>
    @vite('resources/js/app.js')
</head>
<body class="login-page">
    <div class="main-wrapper">
        <img src="{{ asset('images/website_logo_images/Nicsocial logo - White.png') }}" alt="nicsocial logo"
        class="logo-img">
        <div class="main-wrap">
            <h1>Sign Up</h1>
            <form action="{{route('user.signup')}}" method="POST">
                @csrf
                <div class="login-form">
                    <input type="text" placeholder="Username" name="name" required>

                    <input type="text" placeholder="Email" name="email" required>

                    <select name="gender" id="gender">
                        <option value="male">male</option>
                        <option value="female">female</option>
                    </select>


                    <input type="password" placeholder="Password" name="password" required>

                    <button class="signin-btn">Sign Up</button>

                    <p>
                        <a href="{{route('login.page')}}">Already have an account?</a>
                    </p>
                </div>
            </form>
        </div>

        <h3>By Mauricio Rodriguez</h3>

        @if($errors->any())
            @foreach ($errors->all() as $error)
                <p>{{$error}}</p>
            @endforeach
        @endif
        @if (session('message'))
            <h1>{{session('message')}}</h1>
        @endif
    </div>
</body>
</html>