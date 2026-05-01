<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    // fillable
    protected $fillable = ['id', 'title', 'description', 'image', 'likes', 'dislikes', 'times_shared', 'user_id', 'created_at', 'updated_at'];

    // relationship with users (using pivot table).
    public function users() {
        return $this->belongsToMany(User::class);
    }

    // Relationship with User model to keeep track of likes. Second parameter references table name.
    public function likedByUser() {
        return $this->belongsToMany(User::class, 'likes')->withTimestamps();
    }

    // Relationship with User model to keeep track of dislikes. Second parameter references table name.
    public function dislikedByUser() {
        return $this->belongsToMany(User::class, 'dislikes')->withTimestamps();
    }

    // This relationship helps getting the creator of each post model instance.
    public function user() {
        return $this->BelongsTo(User::class);
    }
}
