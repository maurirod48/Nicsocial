import './bootstrap';

function _(element) {
    return document.querySelector(element);
}

if (_('body.login-page')) {
    import('../css/signin_login_css/login.css');
}

if (_('body.forgot-password-page')) {
    import('../css/forgot-password-styling/fp.css');
}

if (_('body.home-page')) {
    import('../css/home-styling/home.css');
    import('./home_js_files/nav-bar.js');
}

if (_('.home-main-container')) {
    import('../js/home_js_files/home.js');
}

if (_('.profile-card-wrapper')) {
    import('../css/home-styling/profile.css');
    import('../js/home_js_files/profile.js');
}

if (_('.people-section-container')) {
    import('../js/home_js_files/people.js');
    import('../css/home-styling/people.css');
}

if (_('.other-profile-section-wrapper')) {
    import('../css/home-styling/other-user-profile.css');
    import('../js/home_js_files/other_profile_page.js');
}

if (_('.settings-section-wrapper')) {
    import('../css/home-styling/settings.css');
}

if (_('.delete-account-section-wrapper') || _('.change-password-section-wrapper')) {
    import('../css/home-styling/delete-account.css');
    import('../js/home_js_files/settings.js');
}

if (_('.change-password-section-wrapper')) {
    import('../css/home-styling/change-password.css');
    import('../js/home_js_files/settings.js');
}