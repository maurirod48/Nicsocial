
// HTML element selector function.

function _(element) {
    return document.querySelector(element);
}

//==================================
// CODE FOR LIKE AND DISLIKE BUTTON.
//==================================



// Variable containing array of all post containers.
const postContainers = document.querySelectorAll('.post-container');

// Adding event listener to each post card.
postContainers.forEach(postCon => {
    postCon.addEventListener('click', (e) => {

        // In case like button is clicked.
        if (e.target.matches('.like-btn')) {
            id4Like(e);
        } else if(e.target.matches('.dislike-btn')) { // In case dislike button is clicked.
            id4Dislike(e);
        }
    })
})

//////////////
// LIKE BUTTON
//////////////


// Function to indentify which post user is trying to like.
function id4Like(e) {

    // HTML element containing post information.
    const postCard = e.target.closest('.post-container');

    // Post id.
    const postId = postCard.querySelector('.post-id').value;

    console.log(postId);

    likePost(postId);

}

function likePost(postId) {

    const jsonObject = {
        'post_id' : postId
    };

    fetch('/other-user-profile/like-post', {
        method: 'POST',
        headers : {
            'Content-Type' : 'application/json',
            'X-CSRF-TOKEN' : _('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify(jsonObject)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Error when trying to like post', jsonObject.postId, res.status);
        } else {
            return res.json();
        }
    })
    .then(data => {
        if (data.success) {
            window.location.reload();
            console.log('success');
        }
    })
    .catch(err => console.error(err))


}

/////////////////
// DISLIKE BUTTON
/////////////////


// Function to indentify which post user is trying to dislike.
function id4Dislike(e) {

    // HTML element containing post information.
    const postCard = e.target.closest('.post-container');

    // Post id.
    const postId = postCard.querySelector('.post-id').value;

    console.log(postId);

    dislikePost(postId);

}

// function to trigger dislike on post.
function dislikePost(postId) {

    fetch(`/dislike-post/${postId}`)
    .then(res => {
        if (!res.ok) {
            throw new Error('Error when trying to like post', jsonObject.postId, res.status);
        } else {
            return res.json();
        }
    })
    .then(data => {
        if (data.success) {
            window.location.reload();
            console.log('success');
        }
    })
    .catch(err => console.error(err))


}