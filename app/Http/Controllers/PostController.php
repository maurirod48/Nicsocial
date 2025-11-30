<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\User;

class PostController extends Controller
{
    public function getPosts() {
        return response()->json(['success' => true]);
    }

    public function createPost(Request $request) {
        // Code to insert post into posts table.

        // Validating data received.
        $input = $request->validate([
            'title' => 'required',
            'description' => 'required',
        ]);


        // I forgot to set a default value for these columns in the "posts" table so I defined them here.
        $input['likes'] = 0;
        $input['dislikes'] = 0;
        $input['times_shared'] = 0;
        $input['user_id'] = Auth()->user()->id;

        if ($request->postPic) {
            // getting file/image name.
            $img = $request->file('postPic');
            $imgName = $img->getClientOriginalName();

            $input['image'] = $imgName;

            $path = $img->storeAs('images/post_images', $imgName, 'public');

        }

        // Inserting new post into "posts" table.
        $post = Post::create($input);

        // creating record to pivot table so there's a link between the post and the author.
        $user = auth()->user();
        $user->posts()->attach($post->id);

        return back()->with('success', 'Post created');
    }

    public function likePost(Request $request) {

        // getting input data from the request.
        $input = $request->json()->all();

        // current user.
        $user = Auth()->user();

        // post id.
        $postId = $input['post_id'];

        // post instance/object.
        $post = Post::findOrFail($postId);


        // number of likes this post currently has.
        $postLikes = $post->likes;

        // number of dislikes this post currently has.
        $postDislikes = $post->dislikes;

        // Checking to see if user has previously disliked the post, if they did, we need to undo that so then a "like"
        // can be added.
        if ($user->dislikedPosts()->where('post_id', $postId)->exists()) {
            // removing relationship in pivot table.
            $user->dislikedPosts()->detach($postId);

            // updating dislikes count.
            $post->update([
                'dislikes' => $postDislikes - 1
            ]);

            $post->save();
        }


        $liked = $user->likedPosts()->where('post_id', $postId)->exists();

        // checking to see if this user has already liked this post.
        if ($liked) {

            // removving like from this post (basic substraction, then update).
            $post->update([
                'likes' => $postLikes - 1
            ]);

            $post->save();

            $user->likedPosts()->detach($post->id);

            return response()->json(['post' => $post, 'success' => true, 'message' => 'disliking this post']);
        } else {
            
            // adding one more like to this post (basic sum, then update).
            $post->update([
                'likes' => $postLikes + 1
            ]);

            $post->save();

            // Now we add new row to the "likes" table to create a record that this user has already liked this post.
            $user->likedPosts()->attach($post->id);
        }


        return response()->json(['post' => $post, 'success' => true, 'message' => 'you just liked this post']);
    }

    public function dislikePost(Post $post) {
        $user = Auth()->user();

        $postCurrentDislikes = $post->dislikes;
        $postCurrentLikes = $post->likes;

        // Checking to see if user has previously liked the post, if they did, we need to undo that so then a "dislike"
        // can be added.
        if ($user->likedPosts()->where('post_id', $post->id)->exists()) {
            // removing relationship in pivot table.
            $user->likedPosts()->detach($post->id);

            // updating dislikes count.
            $post->update([
                'likes' => $postCurrentLikes - 1
            ]);

            $post->save();
        }

        

        if (!$user->dislikedPosts()->where('post_id', $post->id)->exists()) {
            $user->dislikedPosts()->attach($post->id);
            
            $post->update(['dislikes' => $postCurrentDislikes + 1]);

            $message = 'post already disliked';
        } else {
            $user->dislikedPosts()->detach($post->id);

            $post->update(['dislikes' => $postCurrentDislikes - 1]);


            $message = 'post disliked';
        }
        
        return response()->json(['postId' => $post->title, 'success' => true, 'message' => $message]);
    }

    public function deletePost(Request $request) {
        // JSON, getting all JSON data being sent from request.
        $jsonInput = $request->json()->all();

        // post id from request. Grabbing specific piece of info from all the JSON input.
        $postId = $jsonInput['postId'];

        // Post
        $post = Post::findOrFail($postId);

        $post->delete();

        return response()->json(['success' => true, 'id' => $postId]);
    }
}

