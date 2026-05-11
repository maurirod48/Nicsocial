
// HTML element selector function.

function _(element) {
    return document.querySelector(element);
}

//==================================
// CODE FOR LIKE AND DISLIKE BUTTON.
//==================================

//////////////
// LIKE BUTTON
//////////////

// Event listener for like button
_('.like-btn').addEventListener('click', (e) => {
    id4Like(e);
})

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


// Event listener for like button
_('.dislike-btn').addEventListener('click', (e) => {
    id4Dislike(e);
})


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