<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

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

            $path = $img->storeAs('images/post_images', $imgName, 's3');

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

    // This function will get the post object for when the user wants to edit a post. 
    public function getPostObject(Request $request) {
        $jsonInput = $request->json()->all();

        $postId = $jsonInput['id'];

        $post = Post::findOrFail($postId);

        return response()->json(['success' => true, 'id' => $postId, 'post' => $post]);
    }

    public function editPost(Request $request) {
        $input = $request->validate([
            'edit-post-title-input' => 'required',
            'edit-post-desc-input' => 'required'
        ]);

        $id = $request['edit-post-id'];

        // Current post object the user wants to edit.
        $post = Post::findOrFail($id);

        // Image of the post corresponding to the current post to be edited.
        $currentImg = $post->image;

        // Updating post name and post description with the new data in the edit post form.
        $post->update([
            'name' => $input['edit-post-title-input'],
            'description' => $input['edit-post-desc-input']
        ]);

        // This is an instance of the image that could be uploaded when attempting to update a post (Not all posts have images).
        $img = $request->file('new_post_pic');

        // Checking to see if an image was uploaded for this attempt of trying to edit a post.
        if ($img) {
            // Name of new pic.
            $imgName = $img->getClientOriginalName();

            // uploading new post pic.
            $img->storeAs('images/post_images', $imgName, 's3'); // The storeAs first parameter means the path inside /storage/app/public,
            // the second parameter is the name will give to the image and then the third tells Laravel which filesystem disk to use. The disk names come from config/filesystems.php


            // Before we delete the current post image from /storage/app/public/post_images we need to check to see if another post has the same image.
            // cuz if thats the case, then deleting that image will cause problems for that other post's image (Current user is not editing that other post).
            $differentPostHasSameImage = Post::where('image', '=', $currentImg)
                                                ->where('id', "!=", $post->id) // Specifying we are looking a different post to have the same image.
                                                ->exists();

            // If "$differentPostHasSameImage" is false (meaning no other post has the same image) we are good to proceed 
            // and delete that image from /storage/app/public/post_images.
            if (!$differentPostHasSameImage) {
                // This if statement checks for an image inside /storage/app/public/images/post_images
                // which name matches $currentImg.
                if (Storage::disk('s3')->exists('/images/post_images/' . $currentImg)) {
                    Storage::disk('s3')->delete('/images/post_images/' . $currentImg);
                }
            }

            // Now we need to update the name of th post image inside the DB.
            $post->update([
                'image' => $imgName
            ]);

            return back();
        } else {
            return back()->with('messi', 'img was not uploaded');
        }
    }
}
