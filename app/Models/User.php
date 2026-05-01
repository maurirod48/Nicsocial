<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\CanResetPassword;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'gender',
        'profile_pic_path',
        'bio'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Function to get the year, month and day from the created_at value of this user.
    public function created_at_date() {
        return $this->created_at->format('m/d/Y');
    }

    // relationship with posts (using pivot table)
    public function posts() {
        return $this->belongsToMany(Post::class)->withTimestamps();
    }


    // Many-2-Many relationship between the user model and post model but to keep track of likes 
    // (pivot table).
    public function likedPosts() {
        return $this->belongsToMany(Post::class, 'likes')->withTimestamps();
    }

    public function dislikedPosts() {
        return $this->belongsToMany(Post::class, "dislikes")->withTimestamps();
    }

    public function pendingSentFriendRequests() {
        return $this->belongsToMany(User::class, 'friend_requests', 'sender_id', 'receiver_id')->withTimestamps();
    }

    public function pendingReceivedFriendRequest() {
        return $this->belongsToMany(User::class, 'friend_requests', 'receiver_id', 'sender_id')->withTimestamps();
    }

    public function friends() {
        return $this->belongsToMany(User::class, 'friends', 'user_id', 'friend')->withTimestamps();
    }
}
