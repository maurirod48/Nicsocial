<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    @vite('resources/js/app.js')
</head>
<body class="forgot-password-page">
    <div class="reset-password-email-form-wrapper">
        <h1>Reset your password - Request reset password link</h1>
        <div class="reset-password-email-form-wrap">
            
            <form action="{{route('password.email')}}" method="POST">
                @csrf
                <label for="email">Enter email</label>
                <br>
                <input type="email" required placeholder="email" id="email" name="email">
                <br>
                <div class="btn-cont">
                    <button>Request Link</button>
                    <a href="{{route('login.page')}}" class="cancel-request-btn">Cancel request</a>
                </div>
            </form>

            @if(session('success'))
                <h1>{{session('success')}}</h1>
            @endif

            @error('email')
                <h1>{{ $message }}</h1>
            @enderror
        </div>
    </div>
</body>
</html>