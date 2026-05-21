
// COMMONLY USED FUNCTION.
function _(element) {
    return document.querySelector(element);
}

// CSRF token for POST requests to Laravel.
const csrfToken = _('meta[name="csrf-token"]').getAttribute('content');

// VARIABLES TO KEEP TRACK OF PAGINATION.

// keep track of current feed being displayed.
let currentFeed = 'public';

// Keep track of current and last page for home feed.
let publicFeedCurrentPage = 1;
let publicFeedLastPage;
// Keep track of current and last page for friends posts feed.
let friendsFeedCurrentPage = 1;
let friendsFeedLastPage;

//========================================
// CODE TO GET POSTS AND THEN DISPLAY THEM
//========================================


// Public feed radio.
const publicFeedRadio = _('#global');
publicFeedRadio.addEventListener('change', getPublicPosts);

// Friends feed radio.
const friendsFeedRadio = _('#friends-only');
friendsFeedRadio.addEventListener('change', getFriendsOnlyPosts);

// function to get all public posts.
function getPublicPosts() {
    fetch(`/get-public-posts?page=${publicFeedCurrentPage}`)
    .then(res => {
        if (!res.ok) {
            throw new Error('Bad response when trying to get posts:', res.status);
        } else {
            return res.json();
        }
    })
    .then(data => {
        if(data.success) {
            // Updating current feed tracking variable.
            currentFeed = 'public';

            // Display pagination.
            displayPaginationButtons(data.lastPage);

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
        postCard.classList = 'post-card';

        // Checking to if post has an image.
        if (post.image) {

            // Checking to see if user has a profile pic.

            if (post.user.profile_pic_path == 'none') {
                postCard.innerHTML = `
                <input type="hidden" value=${post.id} class="post-id">
                <input type="hidden" value=${post.user.id} class="user-id">
                <div class="post-header">
                    <div class="user-info-container">
                        <img src="/images/default-images/${post.user.gender == 'male' ? 'male-pic.jpg' : 'female-pic.jpeg'}"
                        class="user-img">

                        <div>
                            <h3 class="post-creator-name">${post.user.name}</h3>
                            <p class="post-creator-email">${post.user.email}</p>
                        </div>
                    </div>

                    <div class="post-options-container">
                        
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
                        <img alt="like button" src="/images/website_images/${post.likedByYou ? 'liked.png' : 'like_btn.png'}" class="post-like-btn public-post-btn">
                        <img alt="like button" src="/images/website_images/${post.dislikedByYou ? 'dislike.png' : 'dislike_btn.png'}" public-post-btn" class="post-dislike-btn public-post-btn">
                        <img alt="like button" src="/images/website_images/share_btn.png" class="post-share-btn public-post-btn">
                    </div>
                    <div class="post-stats-container">
                        <p> likes ${post.likes}</p>
                        <p> dislikes ${post.dislikes}</p>
                        <p>shared ${post.times_shared}</p>
                    </div>  
                </div>
                
                `;
            }else {
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
                            <img alt="like button" src="/images/website_images/${post.likedByYou ? 'liked.png' : 'like_btn.png'}" class="post-like-btn public-post-btn">
                            <img alt="like button" src="/images/website_images/${post.dislikedByYou ? 'dislike.png' : 'dislike_btn.png'}" public-post-btn" class="post-dislike-btn public-post-btn">
                            <img alt="like button" src="/images/website_images/share_btn.png" class="post-share-btn public-post-btn">
                        </div>
                        <div class="post-stats-container">
                            <p> likes ${post.likes}</p>
                            <p> dislikes ${post.dislikes}</p>
                            <p>shared ${post.times_shared}</p>
                        </div>  
                    </div>
                    
                `;
            }
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
                        <img alt="like button" src="/images/website_images/${post.likedByYou ? 'liked.png' : 'like_btn.png'}" class="post-like-btn public-post-btn">
                        <img alt="like button" src="/images/website_images/${post.dislikedByYou ? 'dislike.png' : 'dislike_btn.png'}" class="post-dislike-btn public-post-btn">
                        <img alt="like button" src="/images/website_images/share_btn.png" class="post-share-btn public-post-btn">
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

// Function to get posts that friends have posts.
function getFriendsOnlyPosts() {

    fetch(`/get-friends-posts?page=${friendsFeedCurrentPage}`)
    .then(res => {
        if (!res.ok) {
            throw new Error("Something went wrong when trying to get your friends' posts:", res.status);
        } else {
            return res.json();
        }
    })
    .then(data => {
        console.log(data.friendsPosts);

        // Updating current feed tracking variable.
        currentFeed = 'friends';

        // Pagination.
        displayPaginationButtons(data.lastPage);
        
        // Displat friends posts.
        displayFriendsPosts(data.friendsPosts);
    })
    .catch(err => console.error(err))
}

// Display friends.
function displayFriendsPosts(posts) {
    // Grabbing and clearing dynamic section.
    const feed = _('.dynamic-feed-section');
    feed.innerHTML = '';

    // Creating a new <div> HTML element for each post.
    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.classList = 'post-card friend-post';

        // Checking to if post has an image.
        if (post.image) {

            // Checking to see if user has a profile pic.

            if (post.user.profile_pic_path == 'none') {
                postCard.innerHTML = `
                <input type="hidden" value=${post.id} class="post-id">
                <input type="hidden" value=${post.user.id} class="user-id">
                <div class="post-header">
                    <div class="user-info-container">
                        <img src="/images/default-images/${post.user.gender == 'male' ? 'male-pic.jpg' : 'female-pic.jpeg'}"
                        class="user-img">

                        <div>
                            <h3 class="post-creator-name">${post.user.name}</h3>
                            <p class="post-creator-email">${post.user.email}</p>
                        </div>
                    </div>

                    <div class="post-options-container">
                        
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
                        <img alt="like button" src="/images/website_images/${post.likedByYou ? 'liked.png' : 'like_btn.png'}" class="post-like-btn public-post-btn">
                        <img alt="like button" src="/images/website_images/${post.dislikedByYou ? 'dislike.png' : 'dislike_btn.png'}" public-post-btn" class="post-dislike-btn public-post-btn">
                        <img alt="like button" src="/images/website_images/share_btn.png" class="post-share-btn public-post-btn">
                    </div>
                    <div class="post-stats-container">
                        <p> likes ${post.likes}</p>
                        <p> dislikes ${post.dislikes}</p>
                        <p>shared ${post.times_shared}</p>
                    </div>  
                </div>
                
                `;
            }else {
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
                            <img alt="like button" src="/images/website_images/${post.likedByYou ? 'liked.png' : 'like_btn.png'}" class="post-like-btn public-post-btn">
                            <img alt="like button" src="/images/website_images/${post.dislikedByYou ? 'dislike.png' : 'dislike_btn.png'}" public-post-btn" class="post-dislike-btn public-post-btn">
                            <img alt="like button" src="/images/website_images/share_btn.png" class="post-share-btn public-post-btn">
                        </div>
                        <div class="post-stats-container">
                            <p> likes ${post.likes}</p>
                            <p> dislikes ${post.dislikes}</p>
                            <p>shared ${post.times_shared}</p>
                        </div>  
                    </div>
                    
                `;
            }
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
                        <img alt="like button" src="/images/website_images/${post.likedByYou ? 'liked.png' : 'like_btn.png'}" class="post-like-btn public-post-btn">
                        <img alt="like button" src="/images/website_images/${post.dislikedByYou ? 'dislike.png' : 'dislike_btn.png'}" class="post-dislike-btn public-post-btn">
                        <img alt="like button" src="/images/website_images/share_btn.png" class="post-share-btn public-post-btn">
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


///////////////////////////////
// POST BUTTONS FUNCTIONALITY//
///////////////////////////////

// NOTE!
// The following functions basically give funcionality to all the buttons that can be found inside a post: like, share, etc.

//============
// LIKE BUTTON
//============


document.querySelector('.dynamic-feed-section').addEventListener('click', (e) => {
    if (e.target.matches('.post-like-btn')) {
        likeWhatPost(e);
    }
});

// This function checks what post was the "like" button clicked for.
function likeWhatPost(e) {

    // post container element.
    const postContainer = e.target.closest('.post-card');

    // Getting post id.
    const postId = postContainer.querySelector('.post-id').value;

    // This part here helps indetify if the post they are reacting to is inside the public or friends feed.
    let feed;

    if (postContainer.classList.contains('friend-post')) {
        feed = 'friends';
    } else {
        feed = 'public';
    }


    // Calling function that'll execute the liking process.
    likePost(postId, feed);
}

// This functions takes the post ID as parameter and then sends a Fecth request 
// for laravel logic to update the "likes" count for the post.
function likePost(postId, feed) {
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
            if (feed == 'friends') {
                getFriendsOnlyPosts();
            } else if (feed == 'public') {
                getPublicPosts();
            }
        } 
    })
    .catch(err => console.error(err));

    
};


//===============
// DISLIKE BUTTON
//===============

_('.dynamic-feed-section').addEventListener('click', (e) => {
    if (e.target.matches('.post-dislike-btn')) {
        console.log('baaaaf');
        findPostToDislikeID(e);
    }
});


function findPostToDislikeID(e) {

    const post = e.target.closest('.post-card');

    const postId = post.querySelector('.post-id').value;

    // This part here helps indetify if the post they are reacting to is inside the public or friends feed.
    let feed;

    if (post.classList.contains('friend-post')) {
        feed = 'friends';
    } else {
        feed = 'public';
    }

    dislikePost(postId, feed);
}

function dislikePost(id, feed) {

    fetch(`/dislike-post/${id}`,{
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'CSFR-X-TOKEN' : document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Bad Network response:', res.status);
        } else {
            return res.json();
        }
    })
    .then(data => {
        if (data.success) {
            if (feed == 'public') {
                getPublicPosts();
            } else if (feed == 'friends') {
                getFriendsOnlyPosts();
            }
        }
    })
    .catch(err => console.error(err));
}


//========================================
// CODE TO CHECK OUT OTHER USER'S PROFILE.
//========================================
// This is triggered when a user profile picture is clicked in the home feed.


// Checking when user profile picture is clicked.
_('.dynamic-feed-section').addEventListener('click', (e) => {
    if (e.target.matches('.user-img')) {
        console.log('user profile pic clicked');

        // Function to identify which user profile they are trying to check out.
        whatUser(e);
    }
})

// Identify which user profile they are trying to check out.
function whatUser(e) {
    // Variable containing post card HTML element.
    const postCard = e.target.closest('.post-card');

    // User ID which is inside variable postCard.
    const userId = postCard.querySelector('.user-id').value;

    // function to redirect user.
    redirect2UserProfilePage(userId);
}

// Function to redirect user.
function redirect2UserProfilePage(userId) {
    window.location.href = `/other-user-profile/${userId}`;
}

//================
// PAGINATION CODE
//================

const paginationButtonsWrapper = _('.pagination-buttons-wrapper');

function displayPaginationButtons(lastPage) {

    // Checking if there are is than one page for pagination. If there is, then pagination buttons can be displayed.
    if (lastPage > 1) {
        if (currentFeed == 'public') {
            // Updating last page for public feed.
            publicFeedLastPage = lastPage;

            // Inserting buttons into pagination buttons container HTML element.
            paginationButtonsWrapper.innerHTML = `
                <button class="pagination-btn pagination-previous">Previous</button>
                    <p>Page ${publicFeedCurrentPage} of ${lastPage}</p>
                <button class="pagination-btn pagination-next">Next </button>
            `;
        }
        else if (currentFeed == 'friends') {
            // Updating last page for public feed.
            friendsFeedLastPage = lastPage;

            // Inserting buttons into pagination buttons container HTML element.
            paginationButtonsWrapper.innerHTML = `
                <button class="pagination-btn pagination-previous">Previous</button>
                    <p>Page ${friendsFeedCurrentPage} of ${lastPage}</p>
                <button class="pagination-btn pagination-next">Next </button>
            `;
        }
    } else {
        console.log('current feed:', currentFeed);
        console.log('Last page:', lastPage);
        paginationButtonsWrapper.innerHTML = "";
    }
}

// ** PAGINATION BUTTONS
paginationButtonsWrapper.addEventListener('click', (e) => {
    // checking which pagination button was clicked.
    if (e.target.matches('.pagination-previous')) {
        // **PREVIOUS BUTTON FUNCTIONALITY FOR PUBLIC FEED.

        // Verifying current feed and making sure there is a "next page" for display.
        if (currentFeed == 'public' && publicFeedCurrentPage > 1) {
            publicFeedCurrentPage -= 1;
            // Getting all public posts and displaying them.
            getPublicPosts();
        }
        // **PREVIOUS BUTTON FUNCTIONALITY FOR FRIENDS FEED.
        else if (currentFeed == 'friends' && friendsFeedCurrentPage > 1) {
            friendsFeedCurrentPage -= 1;
            getFriendsOnlyPosts();
        }
    } else if (e.target.matches('.pagination-next')) {
        // **NEXT BUTTON FUNCTIONALITY FOR PUBLIC FEED.

        // Verifying current feed and making sure there is a "next page" for display.
        if (currentFeed == 'public' && publicFeedCurrentPage < publicFeedLastPage) {
            publicFeedCurrentPage += 1;
            // Getting all public posts and displaying them.
            getPublicPosts();
        }
        // **PREVIOUS BUTTON FUNCTIONALITY FOR PUBLIC FEED.
        else if (currentFeed == 'friends' && friendsFeedCurrentPage < friendsFeedLastPage) {
            friendsFeedCurrentPage += 1;
            getFriendsOnlyPosts();
        }
    }
});