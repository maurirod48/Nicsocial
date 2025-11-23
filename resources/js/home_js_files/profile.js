// function to grab elements
function _(element) {
    return document.querySelector(element);
}

// CSRF token.
const csrfToken = _('meta[name="csrf-token"]').getAttribute('content');


///////////////////////////////////////
// CHANGE PROFILE PIC CODE
///////////////////////////////////////

// event listener for when "change picture" button is clicked. popup will appear
_('.change-pic-btn').addEventListener('click', toggleChangeProfilePicPopup);

// event listener for when "cancel" button in popup is clicked. popup will disappear.
_('.change-pic-cancel-btn').addEventListener('click', toggleChangeProfilePicPopup);

// function to toggle the "show" class for the change profile pic popup element.
function toggleChangeProfilePicPopup() {
    const popup = _('.change-profile-pic-popup-wrapper');
    popup.classList.toggle('show');
}

function toggleErrorPopupInChangeProfileElement() {
    const popup = document.querySelector('.change-pic-error-wrapper');
    popup.classList.toggle('show');
}

// Input element use to select new profile pic.
const inputToUploadNewProfilePic = _('.new-pic');
// <img> to show a preview of profile pic.
const profilePicPreview = document.querySelector('.preview-profile-pic');

inputToUploadNewProfilePic.addEventListener('change', function (e) {
    // grabbing file(s)/image uploaded.
    const file = e.target.files[0];

    // verifying it's a file.
    if (!file) {
        console.log('No file selected');
        return; // no file selected
    } else {
        console.log('FILE!!')
    }

    // This piece of code checks if the selected file is an image by making use of
    // the JS startsWith method to check the file type.
    if (!file.type.startsWith('image/')) {
        console.log('Not an image');
        inputToUploadNewProfilePic.value = "";
        toggleErrorPopupInChangeProfileElement(); // This is the funcion that makes the pop up saying "please upload an image" show up
        return;
    }

    // Creating local URL for this image to then temporarily display it as a preview.
    const fileURL = URL.createObjectURL(file);

    // Showing preview of new profile pic.
    profilePicPreview.src = fileURL;
});

// This is the "ok" button inside the popup error that shows up when the user uploads a file that is not an image when they trt
// to change their profile pic.
const okBtnInChangePicError = _('.change-pic-error-ok-btn');
// This event listener calls the function that makes the pop up error disappear.
okBtnInChangePicError.addEventListener('click', toggleErrorPopupInChangeProfileElement);


///////////////////////////////////////
// CODE TO MAKE EDIT PROFILE FORM POPUP SHOW UP.
///////////////////////////////////////

// edit profile button in profile page section.
const editBtn = _('.edit-profile-btn');
// event listener for when this button is clicked.
editBtn.addEventListener('click', toggleEditProfileForm);

// cancel button in popup.
const editProfileFormCancelBtn = _('.edit-profile-form-cancel-btn');
// event listener for when this button is clicked.
editProfileFormCancelBtn.addEventListener('click', toggleEditProfileForm);

function toggleEditProfileForm() {
    // grabbing pop up element to edit profile information.
    const editProfilePopupWrapperElement = _('.edit-profile-popup-wrapper');
    editProfilePopupWrapperElement.classList.toggle('show');
}


// checking for when the "ok" is clicked whenever the error popup is showing.
document.addEventListener('click', e => {
    if (e.target.matches('.edit-profile-errors-ok-btn')) {
        toggleEditProfileErrorPopup();
    }
});

function toggleEditProfileErrorPopup() {
    const editProfileErrorsPopup = document.querySelector('.edit-profile-errors-popup-wrapper');
    editProfileErrorsPopup.classList.toggle('show');
}

///////////////////////////////////////
// CODE TO MAKE POST FORM POPUP SHOW UP.
///////////////////////////////////////


// post button element.
const postBtn = _('.post-btn-flex');
// cancel post button
const cancelPost = _('.post-cancel-btn');

// checking if post button is clicked. If it is, then the "togglePostFormPopup" function is called.
postBtn.addEventListener('click', togglePostFormPopup);

// if the form popup is already showing, this checks if user clickes on cancel button, which closes the popup.
cancelPost.addEventListener('click', togglePostFormPopup);


// function to add/remove "show" class from the post popup wrapper classList.
function togglePostFormPopup() {

    console.log('post btn clicked');
    // post popup wrapper element.
    const postFormPopup = _('.post-form-popup-wrapper');

    postFormPopup.classList.toggle('show');
}

///////////////////////////////
// POST BUTTONS FUNCTIONALITY//
///////////////////////////////

// NOTE!
// The following functions basically give funcionality to all the buttons that can be found inside a post: like, share, etc.

//////////////////
// LIKE BUTTON ///
//////////////////


// This function checks what post was the "like" button clicked for.
function likeWhatPost(e) {
    // console.log('like button clicked');

    // post container element.
    const postContainer = e.target.closest('.post-container');

    const postId = postContainer.querySelector('.post-id').value;

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
            location.reload();
            console.log('Post current like count', data.post.likes);
            console.log(data.message);
        } 
    })
    .catch(err => console.error(err));

    
};


// This event listener activates when the like button in a post is clicked.
document.addEventListener('click', (e) => {
    if (e.target.matches('.like-btn-img')) {
        // function that first checks what post was the "like" button clicked for.
        likeWhatPost(e);
    }
});


/////////////////////
// DISLIKE BUTTON ///
/////////////////////
document.addEventListener('click', (e) => {
    if (e.target.matches('.dislike-btn-img')) {
        findPostToDislikeID(e);
    }
});

function findPostToDislikeID(e) {

    const post = e.target.closest('.post-container');

    const postId = post.querySelector('.post-id').value;
    console.log('dislike button was clicked, post ID:', postId);

    dislikePost(postId);
}

function dislikePost(id) {
    console.log('initiating process to send fetch request over to Laravel, ID:', id);

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
            location.reload();
            console.log('SMILE');
            console.log('post title:', data.postId);
            console.log('message:', data.message);
        }
    })
    .catch(err => console.error(err));
}


////////////////////////////////////
// CREATE POST (SHOW PREVIEW IMAGE)/
////////////////////////////////////


const postPicInput = document.querySelector('#upload-img'); // this is the <input> where file/image will be selected.
const previewImageContainer = _('.preview-image-post'); // this is the <img></img> element.
const removePostImagePreviewBtn = _('.remove-post-pic-btn'); // button we click to remove the preview 
// image from display (in case the user changes their mind).

postPicInput.addEventListener('change', e => {
    const file = postPicInput.files[0];
    console.log(file);

    if (file) {
        // creating local URL to host image (valid for this HTTP browser request only).
        const imageURL = URL.createObjectURL(file);

        // populating <img> src attribute with the URL with just created.
        previewImageContainer.src = imageURL;

        // we'll now wanna display the X button to clear the preview image for the user to click in case they change their mind.
        removePostImagePreviewBtn.classList.add('show');
    }

});



// this is what's trigger the the "X" button is clicked, it removes the value inside the <input> and the src from the <img> element.
// when this button is pressed we will also wanna make it disappear (cuz there's no pic selected).
removePostImagePreviewBtn.addEventListener('click', e => {
    postPicInput.value = "";
    previewImageContainer.src = "";
    removePostImagePreviewBtn.classList.remove('show');
});


const check = _('.check-btn');

check.addEventListener('click', e => {
    if (postPicInput.files[0]) {
        console.log('file selected');
    } else {
        console.log('no file selected');
    }
});



////////////////////////////////////////////////////////////
// CODE TO GET CURRENT USER'S POSTS AND THEN DISPLAY THEM.


// Function to get all posts for the current logged in user so they can be displayed in their profile page.

function getPostForCurrentUserOnly ()
 {
    fetch('/get-my-posts')
    .then(res => {
        if (!res.ok) {
            throw new Error(`Network response was not ok: ${res.status}`);
        } else {
            return res.json();
        }
    })
    .then(data => {
        if (data.success) {
            console.log('Posts:', data.posts);
            displayPosts(data.posts);
        } else {
            console.log(data.errorMessage);
        }
        
    })
    .catch(error => {
        console.error(error);
    });
 };

// getPostForCurrentUserOnly();



function displayPosts (posts) {
    console.log('displayPost function called');
    // Grabbing element containing all posts.
    const postsContainer = _('.posts-section');

    // Clearing element containing all posts.
    postsContainer.innerHTML =  ``;

    // username or current logged in user.
    const usernameElement = _('meta[name="current-loggedIn-username"]');
    const username = usernameElement ? usernameElement.getAttribute('content') : null;

    console.log('element:', usernameElement);

    // email or current logged in user.
    const emailElement = _('meta[name="current-loggedIn-email"]');
    const email = emailElement ? emailElement.getAttribute('content') : null;

    // for each posts, a new element is created and this element contains each information for each post.
    posts.forEach(post => {

        // new post container element
        const postCard = document.createElement('div');
        postCard.classList.add('post-card');

        // populating post container
        postCard.innerHTML = `
            <div class="" style="display: flex; gap: .5rem; align-items: center;">
                <p class="post-username">  ${username}</p>
                <p class="post-email">${email}</p>

            </div>

            <p class="post-title">${post.title}</p>

            <p class="post-description">${post.description}</p>

            <div class="post-footer">
                <div class="post-action-buttons" style="display: flex; gap: .5rem;">
                    <img src="images/default-images/like_btn.png" alt="like button image" class="like-btn-img">
                    <img src="images/default-images/dislike_btn.png" alt="like button image" class="dislike-btn-img">
                    <img src="images/default-images/share_btn.png" alt="like button image" class="share-btn-img">
                </div>

                <div class="post-stats" style="display: flex; gap: .5rem;">
                    <p>likes ${post.likes}</p>
                    <p>dislikes ${post.dislikes}</p>
                    <p>shared ${post.times_shared}</p>
                </div>

            </div>    
        `;
        
        // inserting post container element into element containing all posts.
        postsContainer.appendChild(postCard);
    });

}