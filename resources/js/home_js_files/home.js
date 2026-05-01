
// COMMONLY USED FUNCTION.
function _(element) {
    return document.querySelector(element);
}



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

        postCard.innerHTML = `
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
                    <h3>options</h3>
                </div>
                
            </div>

            <div class="post-body">
                <div class="post-description">
                    <p>
                        ${post.description}
                    </p>
                </div>
            </div>
            
        `;

        feed.appendChild(postCard);
    });

}


function getFriendsOnlyPosts() {
    // Grabbing and clearing dynamic section.
    const feed = _('.dynamic-feed-section');
    feed.innerHTML = '';
}