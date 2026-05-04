
// COMMONLY USED FUNCTION.
function _(element) {
    return document.querySelector(element);
}

// CSRF token for POST requests to Laravel.
const csrfToken = _('meta[name="csrf-token"]').getAttribute('content');



//////////////////////////////////////////
// CODE TO GET POSTS AND THEN DISPLAY THEM
//////////////////////////////////////////


// Public feed radio.
const publicFeedRadio = _('#global');
publicFeedRadio.addEventListener('change', getPublicPosts);

// Friends feed radio.
const friendsFeedRadio = _('#friends-only');
friendsFeedRadio.addEventListener('change', getFriendsOnlyPosts);

// function to get all public posts.
function getPublicPosts() {
    fetch('/get-public-posts')
    .then(res => {
        if (!res.ok) {
            throw new Error('Bad response when trying to get posts:', res.status);
        } else {
            return res.json();
        }
    })
    .then(data => {
        if(data.success) {
            console.log(data.publicPosts);
            console.log('posts were returned');

            // Calling function to display public posts.
            displayPublicPosts(data.publicPosts);
        }
    })
    .catch(err => console.log(err));
}

// THIS FUNCTION WILL BE CALLED EVERYTIME USER VISITS HOME PAGE.
getPublicPosts();


function displayPublicPosts(posts) {

    // Grabbing dynamic section.
    const feed = _('.dynamic-feed-section');
    feed.innerHTML = '';

    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.classList = 'public-post-card';

        // Checking to if post has an image.
        if (post.image) {

            postCard.innerHTML = `
                <input type="hidden" value=${post.id} class="post-id">
                <input type="hidden" value=${post.user.id} class="user-id">
                <div class="post-header">
                    <div class="user-info-container">
                        <img src="https://nicsocial-images.s3.us-east-2.amazonaws.com/images/other_images/${post.user.profile_pic_path}"
                        class="user-img">

                        <div>
                            <h3 class="post-creator-name">${post.user.name}</h3>
                            <p class="post-creator-email">${post.user.email}</p>
                        </div>
                    </div>

                    <div class="post-options-container">
                        <img src="/images/website_images/three_dots.png" alt="post-options-image" class="post-options-image">
                    </div>
                    
                </div>

                <div class="post-body">
                    <h1 class="post-title">${post.title}</h1>
                    <div class="post-description">
                        <p>
                            ${post.description}
                        </p>
                    </div>

                    <img src="https://nicsocial-images.s3.us-east-2.amazonaws.com/images/post_images/${post.image}" class="post-img" alt="post-image">
                </div>

                <div class="post-footer">
                    <div class="post-react-btn-container">
                        <img alt="like button" src="/images/website_images/${post.likedByYou ? 'liked.png' : 'like_btn.png'}" class="post-like-btn post-btn">
                        <img alt="like button" src="/images/website_images/dislike_btn.png" class="post-dislike-btn post-btn">
                        <img alt="like button" src="/images/website_images/share_btn.png" class="post-share-btn post-btn">
                    </div>
                    <div class="post-stats-container">
                        <p> likes ${post.likes}</p>
                        <p> dislikes ${post.dislikes}</p>
                        <p>shared ${post.times_shared}</p>
                    </div>  
                </div>
                
            `;
        } else if (!postCard.image) {

                postCard.innerHTML = `
                    <input type="hidden" value=${post.id} class="post-id">
                    <input type="hidden" value=${post.user.id} class="user-id">
                    <div class="post-header">
                        <div class="user-info-container">
                            <img src="https://nicsocial-images.s3.us-east-2.amazonaws.com/images/other_images/${post.user.profile_pic_path}"
                            class="user-img">

                            <div>
                                <h3 class="post-creator-name">${post.user.name}</h3>
                                <p class="post-creator-email">${post.user.email}</p>
                            </div>
                        </div>

                        <div class="post-options-container">
                            <img src="/images/website_images/three_dots.png" alt="post-options-image" class="post-options-image">
                        </div>
                        
                    </div>

                    <div class="post-body">
                        <h1 class="post-title">${post.title}</h1>
                        <div class="post-description">
                            <p>
                                ${post.description}
                            </p>
                        </div>

                    </div>
                    
                    <div class="post-footer">
                    <div class="post-react-btn-container">
                        <img alt="like button" src="/images/website_images/${post.likedByYou ? 'liked.png' : 'like_btn.png'}" class="post-like-btn post-btn">
                        <img alt="like button" src="/images/website_images/dislike_btn.png" class="post-dislike-btn post-btn">
                        <img alt="like button" src="/images/website_images/share_btn.png" class="post-share-btn post-btn">
                    </div>
                    <div class="post-stats-container">
                        <p> likes ${post.likes}</p>
                        <p> dislikes ${post.dislikes}</p>
                        <p>shared ${post.times_shared}</p>
                    </div>
            `;
        }

        feed.appendChild(postCard);
    });

}


function getFriendsOnlyPosts() {
    // Grabbing and clearing dynamic section.
    const feed = _('.dynamic-feed-section');
    feed.innerHTML = '';
}


///////////////////////////////
// POST BUTTONS FUNCTIONALITY//
///////////////////////////////

// NOTE!
// The following functions basically give funcionality to all the buttons that can be found inside a post: like, share, etc.

//////////////////
// LIKE BUTTON ///
//////////////////


document.querySelector('.dynamic-feed-section').addEventListener('click', (e) => {
    if (e.target.matches('.post-like-btn')) {
        console.log('1000 billion points');
        likeWhatPost(e);
    }
});

// This function checks what post was the "like" button clicked for.
function likeWhatPost(e) {

    // post container element.
    const postContainer = e.target.closest('.public-post-card');

    const postId = postContainer.querySelector('.post-id').value;

    console.log('Post id:', postId);
    // Calling function that'll execute the liking process.
    likePost(postId);
}

// This functions takes the post ID as parameter and then sends a Fecth request 
// for laravel logic to update the "likes" count for the post.
function likePost(postId) {
    console.log(postId);

    // we need to send the info as JSON therefore I create this object.
    const postIdObject = {
        'post_id' : postId
    }

    // Fetch request to Laravel route for logic that will update "like" count for post.
    fetch(`/profile-section/like-post`, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'X-CSRF-TOKEN' : csrfToken
        },
        body: JSON.stringify(postIdObject)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Error when sending request to like post:', res.status);
        } else {
            return res.json();
        }
    })
    .then(data => {
        if (data.success) {
            getPublicPosts();
            console.log('Post current like count', data.post.likes);
            console.log(data.message);
        } 
    })
    .catch(err => console.error(err));

    
};