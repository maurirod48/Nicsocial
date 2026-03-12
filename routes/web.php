<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\PeopleController;
use App\Http\Controllers\PostController;

use App\Models\Product;

// SIGNIN LOGIN ROUTES

// this route sends user to login page.
Route::get('/', function () {
    return view('signin_login.login');
})->name('login.page');


// this route sends user to signin page.
Route::get('/signin-page', function () {
    return view('signin_login.signin');
})->name('signin.page');


// This route triggers the sign in process.
Route::post('/user-signin', [UserController::class, 'signIn'])->name('user.signin');

// This route triggers the log in process.
Route::post('/user-login', [UserController::class,'logIn'])->name('user.login');

//PASSWORD RESET ALGORITHM

Route::get('/forgot-password', [ForgotPasswordController::class, 'create'])->name('password.request');

Route::post('/forgot-password', [ForgotPasswordController::class, 'store'])->name('password.email');

Route::get('/reset-password/{token}', [ResetPasswordController::class, 'create'])->name('password.reset');

Route::post('/reset-password', [ResetPasswordController::class,'store'])->name('password.update');

// =============
// HOME ROUTES
// ==============

// Go to home page
Route::get('/home-section', function () {
    return view('home.home');
})->name('home.section');

// Go to people page.
Route::get('/people-section', function () {
    return view('home.people');
})->name('people.section');

// Go to profile page.
Route::get('/profile-section', function () {
    // current authenticated user.
    $user = Auth()->user();

    // All posts belonging to current authenticated user.
    $currentUserPosts = $user->posts;

    // Reversing order of array so that latests posts are shown first.
    $reversedArrayOfCurrentUserPosts = $currentUserPosts->reverse();

    // redirecting user to profile page and passing all posts to the page to then display em.
    return view('home.profile-page', ['posts' => $reversedArrayOfCurrentUserPosts]);
})->name('profile.section');

// This request will come from a JS fetch request to get all posts.
Route::get('/get-posts', [PostController::class, 'getPosts'])->name('post.get');

// Route to trigger logout.
Route::post('/logout', [UserController::class, 'logout'])->name('user.logout');


// ========================
// PROFILE SECTION ROUTES 
// ========================

// This route is called by JS fetch request to get all posts that the current user has created.
Route::get('/get-my-posts', [UserController::class, 'getPosts']);

// This route is called when user submits "edit profile" form.
Route::post('/edit-profile', [UserController::class, 'editProfile'])->name('profile.edit');

// POST: this route is called when a user tries to create a post.
Route::post('/create-post', [PostController::class, 'createPost'])->name('post.create');

// This route is called when user tries to change their profile pic.
Route::post('/change-profile-pic', [UserController::class, 'changeProfilePic'])->name('change.profile.pic');

// Route to like post.
Route::post('/profile-section/like-post', [PostController::class, 'likePost']);

// Route to dislike post.
Route::get('/dislike-post/{post}', [PostController::class, 'dislikePost']);

// Route to delete post.
Route::post('/delete-post', [PostController::class, 'deletePost']);

// Route to get single post object.
Route::post('/get-post-object/edit', [PostController::class, 'getPostObject']);

//Route to edit post.
Route::post('/edit-post', [PostController::class, 'editPost'])->name('post.edit');


// ========================
// PEOPLE SECTION ROUTES 
// ========================

Route::get('/people/users', [PeopleController::class, 'getPeople']);

// Send friend request = Create record in friend_requests pivot table.
Route::post('/people/friend-request', [PeopleController::class, 'friendRequest']);