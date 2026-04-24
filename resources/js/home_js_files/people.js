

// console.log('people sectiooooonnnn!!');
function _(element) {
    return document.querySelector(element);
}

// CSRF token.
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// This part of the code calls a different function depending on which radio (friends/people) is currently checked.
// It will either call the function that displays friends or the function that displays people.


// Radio elements.
const friendsRadio = _('#friends-radio');
const peopleRadio = _('#people-radio');
const requestRadio = _('#requests-radio');

// Tab elements.
const friendsTab = _('.friends-tab');
const peopleTab = _('.people-tab');
const requestsTab = _('.requests-tab');


// Friends radio is checked by default when the people page is loaded.
if (friendsRadio.checked) {
    console.log('friends radio checked by default');
    displayFriends();
}


friendsRadio.addEventListener('change', function () {
    if (this.checked) {
        console.log('friends');
        displayFriends(friends);
    }
});

peopleRadio.addEventListener('change', function () {
    if (this.checked) {
        console.log('people');
        getPeople();
    }
});

/////////////////////////
// DISPLAY FRIENDS CODE.
/////////////////////////

async function getMyFriends() {

    // while friends are retrived in the backend we want to show the loading GIF.
    const blueLoadingGIF = _('.loading-gif-container');
    blueLoadingGIF.classList.add('show');

    try {
        const res = await fetch('/people/get-my-friends');

        if (!res.ok) {
            throw new Error('Error when tryina get all friends:', res.status);
        }

        const data = await res.json();

        return data.friends;

    } catch (err) {
        console.error(err);
    }
}

async function displayFriends() {

    peopleTab.classList.add('disabled');
    requestsTab.classList.add('disabled');

    // Dynamic section.
    const dynamicSection = _('.dynamic-section');

    dynamicSection.innerHTML = '';

    // Calling async function to get friends.
    const friends = await getMyFriends();

    console.log('My friends:', friends);

    for (const user of friends) {
        console.log('Friend name:', user.name);
        const userCard = document.createElement('div');
        userCard.classList = 'user-card';

        if (user.profile_pic_path != 'none') {
            userCard.innerHTML = `
            <div style="display:flex; gap:1rem; align-items:center;">
                <input type="hidden" class="user-id" value="${user.id}">
                <img src="${user.profile_pic_s3_url}" class="user-profile-pic" data-mssg="first-block">
                <h1 class="user-name">${user.name}</h1>
            </div>

            <div>
                <button class="unfriend-btn">unfriend</button>
            </div>
                        
                    `;
            } else if (user.profile_pic_path == 'none' && user.gender == 'male') {
                userCard.innerHTML = `
                    <div style="display:flex; gap:1rem; align-items:center;">
                        <input type="hidden" class="user-id" value="${user.id}">
                        <img src="/storage/images/other_images/male-pic.jpg" class="user-profile-pic">
                        <h1 class="user-name">${user.name}</h1>
                    </div>

                    <div>
                        <button class="unfriend-btn">unfriend</button>
                    </div>
                    `;
            } else if (user.profile_pic_path == 'none' && user.gender == 'female') {
                userCard.innerHTML = `
                    <div style="display:flex; gap:1rem; align-items:center;">
                        <input type="hidden" class="user-id" value="${user.id}">
                        <img src="/storage/images/other_images/female-pic.jpeg" class="user-profile-pic">
                        <h1 class="user-name">${user.name}</h1>
                    </div>

                    <div>
                        <button class="unfriend-btn">unfriend</button>
                    </div>
                `;
            }

        dynamicSection.appendChild(userCard);
    }

    // Making other tabs clickable again.
    peopleTab.classList.remove('disabled');
    requestsTab.classList.remove('disabled');

    // Removing loading GIF once all friends have been displayed.
    const blueLoadingGIF = _('.loading-gif-container');
    blueLoadingGIF.classList.remove('show');
}

// Code to get all friends requests (all users this currently logged in user has sent a friend request to). This will later be used to decide what button to display for a user (add friend/cancel request).

let friendRequests;

async function getFriendRequestInstances() {

    try {
        const response = await fetch('/people/get-friend-requests');

        if (!response.ok) {
            throw new Error('Something went wrong when trying to get all friend requests:', response.status);
        }

        const data = await response.json();

        return data.response;

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

//////////////////////
// DISPLAY PEOPLE CODE.
///////////////////////

// Code to get all users and display them.

let people; // all people/users.
let friends; // friends only.

// function to get all users except the one who's currently logged in (cuz why would we need to display that user in this section?).
function getPeople() {

    // while users are retrived in the backend we want to show the loading GIF.
    const blueLoadingGIF = _('.loading-gif-container');
    blueLoadingGIF.classList.add('show');

    fetch('/people/users')
    .then(res => {
        if (!res.ok) {
            throw new Error('Error while trying to get all users:', res.status);
        } else {
            return res.json();
        }
    })
    .then(data => {
        people = data.people;
        console.log(people);
        displayPeople(people);
    })
    .catch(err => console.log(err));
}

// This function will return true or false depending on if a friend request has been sent toa user that will be displayed in the people section.
async function checkingSentForFriendRequest(userId) {

    try {
        const response = await fetch(`/people/get-friend-request-status/${userId}`);

        if (!response.ok) {
            throw new Error(`Error while trying to get friend requests status for user ${userId}: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.error('error:', error);
    }
}

async function receivedFriendRequest(userId) {
    try {
        const res = await fetch(`/people/check-for-received-friend-request/${userId}`);
        if (!res.ok) {
            throw new Error(`Error while tryina see if user with id ${userId} has sent me a friend request`);
        }

        const data = await res.json();

        if (data.success) {
            return true;
        } else {
            return false;
        }

    } catch(error) {
        console.error(error);
    }
}

// function to check if Im already friends with a user. This is helpful because if this return true, then we dont display that user in this section.
async function AreWeFriendsAlready(userId) {
    try {
        const res = await fetch(`/people/friends-already/${userId}`);

        if (!res.ok) {
            throw new Error('Error when trying to check for user friend relationship:', res.status);
        }

        const data = await res.json();

        if (data.success) {
            return true;
        } else {
            return false;
        }

    } catch(err) {
        console.error(err)
    }
}



async function displayPeople(people) {


    // Disabling click event listeners for other tabs.
    friendsTab.classList.add('disabled');
    requestsTab.classList.add('disabled');

    // Dynamic section.
    const dynamicSection = _('.dynamic-section');

    // clearing dynamic view.
    dynamicSection.innerHTML = '';

    // get all friend requests instances.
    friendRequests = await getFriendRequestInstances();
    console.log('friend requests array data:', friendRequests);

    // creating user card for each user.
    for (const user of people) {

        const alreadyFriends = await AreWeFriendsAlready(user.id);

        if (!alreadyFriends) {
            const userCard = document.createElement('div');
            userCard.classList = 'user-card';

            // This variable here will be true or false and will let us know if the currently logged in 
            // user has already sent a friend request to the user that it is to be displayed.
            const friendRequestStatus = await checkingSentForFriendRequest(user.id);

            // This variable will be true if the user to displayed had already sent us a friend request, cuz if thats the case, then the only option we have is to accept or reject.
            const haveIreceivedFriendRequestFromThisUser = await receivedFriendRequest(user.id);

            if (haveIreceivedFriendRequestFromThisUser) {
                if (user.profile_pic_path != 'none') {
                    userCard.innerHTML = `
                        <div style="display:flex; gap:1rem; align-items:center;">
                            <input type="hidden" class="user-id" value="${user.id}">
                            <img src="${user.profile_pic_s3_url}" class="user-profile-pic" data-mssg="first-block">
                            <h1>${user.name}</h1>
                        </div>

                        <div>
                            <button class="accept-friend-request-btn">confirm</button>
                            <button class="delete-friend-request-btn">delete</button>
                        </div>
                        
                    `;
                } else if (user.profile_pic_path == 'none' && user.gender == 'male') {
                    userCard.innerHTML = `
                        <div style="display:flex; gap:1rem; align-items:center;">
                            <input type="hidden" class="user-id" value="${user.id}">
                            <img src="/storage/images/other_images/male-pic.jpg" class="user-profile-pic">
                            <h1>${user.name}</h1>
                        </div>

                        <div>
                            <button class="accept-friend-request-btn">confirm</button>
                            <button class="delete-friend-request-btn">delete</button>
                        </div>
                    `;
                } else if (user.profile_pic_path == 'none' && user.gender == 'female') {
                    userCard.innerHTML = `
                        <div style="display:flex; gap:1rem; align-items:center;">
                            <input type="hidden" class="user-id" value="${user.id}">
                            <img src="/storage/images/other_images/female-pic.jpeg" class="user-profile-pic">
                            <h1>${user.name}</h1>
                        </div>

                        <div>
                            <button class="accept-friend-request-btn">confirm</button>
                            <button class="delete-friend-request-btn">delete</button>
                        </div>
                    `;
                }
            }
            else if (friendRequestStatus) {
                if (user.profile_pic_path != 'none') {
                    userCard.innerHTML = `
                        <div style="display:flex; gap:1rem; align-items:center;">
                            <input type="hidden" class="user-id" value="${user.id}">
                            <img src="${user.profile_pic_s3_url}" class="user-profile-pic" data-mssg="first-block">
                            <h1>${user.name}</h1>
                        </div>

                        <button class="cancel-friend-request-btn">cancel request</button>
                    `;
                } else if (user.profile_pic_path == 'none' && user.gender == 'male') {
                    userCard.innerHTML = `
                        <div style="display:flex; gap:1rem; align-items:center;">
                            <input type="hidden" class="user-id" value="${user.id}">
                            <img src="/storage/images/other_images/male-pic.jpg" class="user-profile-pic">
                            <h1>${user.name}</h1>
                        </div>

                        <button class="cancel-friend-request-btn">cancel request</button>
                    `;
                } else if (user.profile_pic_path == 'none' && user.gender == 'female') {
                    userCard.innerHTML = `
                        <div style="display:flex; gap:1rem; align-items:center;">
                            <input type="hidden" class="user-id" value="${user.id}">
                            <img src="/storage/images/other_images/female-pic.jpeg" class="user-profile-pic">
                            <h1>${user.name}</h1>
                        </div>

                        <button class="cancel-friend-request-btn">cancel request</button>
                    `;
                }
            } 
            else {
                if (user.profile_pic_path != 'none') {
                    userCard.innerHTML = `
                        <div style="display:flex; gap:1rem; align-items:center;">
                            <input type="hidden" class="user-id" value="${user.id}">
                            <img src="${user.profile_pic_s3_url}" class="user-profile-pic" data-mssg="first-block">
                            <h1>${user.name}</h1>
                        </div>

                        <button class="add-friend-btn">Add friend</button>
                    `;
                } else if (user.profile_pic_path == 'none' && user.gender == 'male') {
                    userCard.innerHTML = `
                        <div style="display:flex; gap:1rem; align-items:center;">
                            <input type="hidden" class="user-id" value="${user.id}">
                            <img src="/storage/images/other_images/male-pic.jpg" class="user-profile-pic">
                            <h1>${user.name}</h1>
                        </div>

                        <button class="add-friend-btn">Add friend</button>
                    `;
                } else if (user.profile_pic_path == 'none' && user.gender == 'female') {
                    userCard.innerHTML = `
                        <div style="display:flex; gap:1rem; align-items:center;">
                            <input type="hidden" class="user-id" value="${user.id}">
                            <img src="/storage/images/other_images/female-pic.jpeg" class="user-profile-pic">
                            <h1>${user.name}</h1>
                        </div>

                        <button class="add-friend-btn">Add friend</button>
                    `;
                }
            }
            
            // adding user card to dynamic section.
            dynamicSection.appendChild(userCard);

        // here    
        } else {
            console.log(`User ${user.name} is already my friend`);
        }

        
    }

    // Making other tabs clickable again.
    friendsTab.classList.remove('disabled');
    requestsTab.classList.remove('disabled');

    // Removing loading GIF once all users have been deployed.
    const blueLoadingGIF = _('.loading-gif-container');
    blueLoadingGIF.classList.remove('show');
}
//////////////////////////
// SEND FRIEND REQUEST CODE.
///////////////////////////

document.querySelector('.dynamic-section').addEventListener('click', e => {
    if (e.target.matches('.add-friend-btn')) {
        console.log('add friend btn clicked');

        // Grabbing the user card div element.
        const userCard = e.target.closest('.user-card');
        
        // User ID:
        const userId = userCard.querySelector('.user-id').value;
        sendFriendRequest(userId);
    }
})

function sendFriendRequest(friendId) {

    const userInfo = {
        'id' : friendId
    };

    fetch('/people/friend-request', {
        method: 'POST',
        headers : {
            'Content-Type' : 'application/json',
            'X-CSRF-TOKEN' : csrfToken
        },
        body: JSON.stringify(userInfo)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Error when trying to send friend request:', res.status);
        } else {
            return res.json();
        }
    })
    .then(data => {
        console.log('From fetch response:', data.id);
        getPeople();
    })
    .catch(err => console.error(err))
}
////////////////////////
// CANCEL FRIEND REQUEST
/////////////////////////

document.querySelector('.dynamic-section').addEventListener('click', (e) => {
    if (e.target.matches('.cancel-friend-request-btn')) {
        console.log('cancel');
        whichRequestToCancel(e);
    }
})

// Function to find out which user request is trying to be canceled.
function whichRequestToCancel(e) {
    const userCard = e.target.closest('.user-card');
    const userId = userCard.querySelector('.user-id').value;

    cancelFriendRequest(userId);
}

function cancelFriendRequest(userId) {
    console.log(userId);

    fetch(`/people/cancel-friend-request/${userId}`)
    .then(res => {
        if (!res.ok) {
            throw new Error("Error while trying to cancel friend request");
        } else {
            return res.json();
        }
    })
    .then(data => {
        if (data.success) {
            console.log('Friend request cancel');
            getPeople();
        }
    })
}

////////////////////////////////////
// DISPLAY RECEIVED FRIEND REQUESTS
////////////////////////////////////

let usersWhoHaveSentMeFriendRequest;

document.querySelector('.requests-tab').addEventListener('click', getReceivedFriendRequests);

// This function makes the variable "usersWhoHaveSentMeFriendRequest" be equal to all the friend requests 
// that the logged in user has received for them to then be displayed.
function getReceivedFriendRequests() {

    // while friend requests are retrived in the backend we want to show the loading GIF.
    const blueLoadingGIF = _('.loading-gif-container');
    blueLoadingGIF.classList.add('show');

    fetch('/people/get-received-friend-requests')
    .then(res => {
        if (!res.ok) {
            throw new Error('Error while tryina get friend:', res.status);
        } else {
            return res.json();
        }
    })
    .then(data => {
        if (data.success) {
            usersWhoHaveSentMeFriendRequest = data.response;
            console.log('People who have sent you friend requests:', usersWhoHaveSentMeFriendRequest);
            displayReceivedFriendRequests(usersWhoHaveSentMeFriendRequest);
        }
    })


}

function displayReceivedFriendRequests(data) {

    // Disabling click event listeners for other tabs.
    friendsTab.classList.add('disabled');
    peopleTab.classList.add('disabled');

    // Clearing dynamic section.
    const dynamicSection = document.querySelector('.dynamic-section');
    dynamicSection.innerHTML = '';

    data.forEach(user => {
        const userCard = document.createElement('div');
        userCard.classList = 'user-card-received-request';


        if (user.profile_pic_path != 'none') {
                    userCard.innerHTML = `
                        <div style="display:flex; gap:1rem; align-items:center;">
                            <input type="hidden" class="user-id" value="${user.id}">
                            <img src="${user.profile_pic_s3_url}" class="user-profile-pic" data-mssg="first-block">
                            <h1>${user.name}</h1>
                        </div>

                        <div>
                            <button class="accept-friend-request-btn">confirm</button>
                            <button class="delete-friend-request-btn">delete</button>
                        </div>
                    `;
        } else if (user.profile_pic_path == 'none' && user.gender == 'male') {
                    userCard.innerHTML = `
                        <div style="display:flex; gap:1rem; align-items:center;">
                            <input type="hidden" class="user-id" value="${user.id}">
                            <img src="/storage/images/other_images/male-pic.jpg" class="user-profile-pic">
                            <h1>${user.name}</h1>
                        </div>

                        <div>
                            <button class="accept-friend-request-btn">confirm</button>
                            <button class="delete-friend-request-btn">delete</button>
                        </div>
                    `;
        } else if (user.profile_pic_path == 'none' && user.gender == 'female') {
                    userCard.innerHTML = `
                        <div style="display:flex; gap:1rem; align-items:center;">
                            <input type="hidden" class="user-id" value="${user.id}">
                            <img src="/storage/images/other_images/female-pic.jpeg" class="user-profile-pic">
                            <h1>${user.name}</h1>
                        </div>

                        <div>
                            <button class="accept-friend-request-btn">confirm</button>
                            <button class="delete-friend-request-btn">delete</button>
                        </div>
                    `;
        }

        dynamicSection.appendChild(userCard);
    })

    // Making other tabs clickable again.
    friendsTab.classList.remove('disabled');
    peopleTab.classList.remove('disabled');

    // while friends are retrived in the backend we want to show the loading GIF.
    const blueLoadingGIF = _('.loading-gif-container');
    blueLoadingGIF.classList.remove('show');
}

//////////////////////////////
// REJECT FRIEND REQUEST CODE
//////////////////////////////
document.querySelector('.dynamic-section').addEventListener('click', (e) => {
    if (e.target.matches('.delete-friend-request-btn')) {
        console.log('delete');
        deleteWhichFriendRequest(e);
    }
})

function deleteWhichFriendRequest(e) {
    const userCard1 = e.target.closest('.user-card');
    const userCard2 = e.target.closest('.user-card-received-request');

    let userId

    if (userCard1) {
        userId = userCard1.querySelector('.user-id').value;
    } else if (userCard2) {
        userId = userCard2.querySelector('.user-id').value;
    }

    const reloadSection = userCard1 ? 'people' : 'pending friend requests';

    console.log(userId);
    deleteFriendRequest(userId)
}

// The second parameter for this function is just to know which section 
// we are reloading, it could be the people section or the friend requests section depending on from 
// where the user is deleting the friend request.
function deleteFriendRequest(userId, reloadsection) {

    const jsonData = {
        'id' : userId
    };

    fetch('/people/delete-friend-request', {
        method: 'POST',
        headers : {
            'Content-Type':'application/json',
            'X-CSRF-TOKEN':csrfToken
        },
        body: JSON.stringify(jsonData)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Error while trying to send request to delete friend request.');
        } else {
            return res.json();
        }
    })
    .then(data => { 
        if (data.success) {
            location.reload();
            console.log('Friend request was deleted');

        }
    })
    .catch(err => console.error(err))
}

//////////////////////////////
// ACCEPT FRIEND REQUEST CODE
//////////////////////////////

document.querySelector('.dynamic-section').addEventListener('click', (e) => {
    if (e.target.matches('.accept-friend-request-btn')) {

        let userCard;
        
        if (e.target.closest('.user-card')) {
            userCard = e.target.closest('.user-card');
        }
        else if (e.target.closest('.user-card-received-request')) {
            userCard = e.target.closest('.user-card-received-request')
        }
        
        const userId = userCard.querySelector('.user-id').value;

        console.log('accept');
        console.log('user id:', userId);

        acceptFriendRequest(userId);
    }
})

function acceptFriendRequest(userId) {
    
    const data = {
        'id' : userId
    };

    fetch('/people/accept-friend-request', {
        method: 'POST',
        headers : {
            'Content-Type' : 'application/json',
            'X-CSRF-TOKEN':csrfToken
        },
        body: JSON.stringify(data)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Error while trying to accept friend request:', res.status);
        } else {
            return res.json();
        }
    })
    .then(data => {
        if (data.success) {
            console.log('friend request accepted');
            location.reload();
        }
        
    })
    .catch(err => console.error(err))
}

///////////////////////////
// UNFRIEND/DELETE FRIEND
//////////////////////////

let user2Unfriend; // ID of the user to be deleted/unfriended.

// Checking for when "unfriend" button is clicked. When it is, we need to find out which friend the user is trying to unfriend.
// We also need to show a popup window asking to confirm this action.
_('.dynamic-section').addEventListener('click', (e) => {
    if (e.target.matches('.unfriend-btn')) {
        console.log('unfriend');

        const userCard = e.target.closest('.user-card');
        const userId = userCard.querySelector('.user-id').value;
        const userName = userCard.querySelector('.user-name').textContent;

        console.log('Unfriend:', userId);
        console.log('Username to unfriend:', userName);

        user2Unfriend = userId; // Variable will be used later to actually unfriend a user.

        toggleConfirmUnfriendPopUpWindow(userName);
    }
});

// Show popup to confirm the unfriending of a user.
function toggleConfirmUnfriendPopUpWindow(userName) {

    const popup = _('.confirm-unfriend-popup-wrapper');
    popup.classList.toggle('show');

    const text = _('.confirm-unfriend-popup-text');
    text.textContent = `Unfriend ${userName}?`;
}

document.addEventListener('click', (e) => {
    if (e.target.matches('.confirm-unfriend-popup-wrapper')) {
        toggleConfirmUnfriendPopUpWindow();
    }
});

// Eventlistener for "No" button inside the "unfriend user" popup screen.
_('.unfriend-no-btn').addEventListener('click', toggleConfirmUnfriendPopUpWindow);


// Evvent listener for then the user clicks on the "yes" button to unfriend a user (the user ID should already be stored in the variable previously defined).
document.querySelector('.unfriend-yes-btn').addEventListener('click', deleteFriend);

function deleteFriend() {
    console.log('Unfriend user:', user2Unfriend);

    const data = {
        'id' : user2Unfriend
    };

    // Send DELETE request to Laravel route.
    fetch('/people/delete-friend', {
        method: 'DELETE',
        headers : {
            'Content-Type' : 'application/json',
            'X-CSRF-TOKEN' : csrfToken
        },
        body: JSON.stringify(data)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Error when trying to delete friend:', res.status);
        } else {
            return res.json();
        }
    })
    .then(data => {
        if (data.success) { 
            console.log("Friend deleted");
            toggleConfirmUnfriendPopUpWindow();
            displayFriends();
        }
    })
    .catch(err => console.error(err))

}