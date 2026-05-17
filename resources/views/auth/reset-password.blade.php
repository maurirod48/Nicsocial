<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Reset Password</title>
    @vite('resources/js/app.js')
</head>
<body class="forgot-password-page">
    <div class="reset-password-form-wrapper">
        <div class="reset-password-form-wrap">
            <h1>Reset Password</h1>
            <div class="reset-password-form">
                <form action="{{route('password.update')}}" method="POST">
                    @csrf
                    <input type="hidden" name="token" value="{{$token}}">
                    <input type="text" name="email" placeholder="Enter email" required>
                    <br>
                    <input type="password" name="password"
                    placeholder="New Password"
                    required>
                    <br>
                    <input type="password" required
                    placeholder="Confirm Password" name="password_confirmation">
                    <br>
                    <button>Submit</button>
                </form>
                {{-- for errors regarding form --}}
                @if ($errors->any())
                    @foreach ($errors->all() as $error)
                        <p>{{$error}}</p>
                    @endforeach
                @endif

                {{-- for errors regarding password update --}}
                @if (session('success'))
                    <h1>{{session('success')}}</h1>
                @elseif (session('error'))
                    <h1>{{session('error')}}</h1>
                @endif
            </div>
        </div>
    </div>
</body>
</html>