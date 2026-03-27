

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

// Friends radio is checked by default when the people page is loaded.
if (friendsRadio.checked) {
    console.log('friends radio checked by default');
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
function displayFriends(friends) {
    const dynamicSection = _('.dynamic-section');

    dynamicSection.innerHTML = '';

    console.log('My friends:', friends);
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
    console.log('getting people');
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
                console.log(`USER ${user.name} HAS SENT ME A FRIEND REQUEST`);
                if (user.profile_pic_path != 'none') {
                    userCard.innerHTML = `
                        <div style="display:flex; gap:1rem; align-items:center;">
                            <input type="hidden" class="user-id" value="${user.id}">
                            <img src="/storage/images/other_images/${user.profile_pic_path}" class="user-profile-pic" data-mssg="first-block">
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
                            No pic
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
                            No pic
                        </div>

                        <div>
                            <button class="accept-friend-request-btn">confirm</button>
                            <button class="delete-friend-request-btn">delete</button>
                        </div>
                    `;
                }
            }
            else if (friendRequestStatus) {
                console.log(`I HAVE SENT A FRIEND REQUEST TO USER: ${user.name} TRUE`);
                if (user.profile_pic_path != 'none') {
                    userCard.innerHTML = `
                        <div style="display:flex; gap:1rem; align-items:center;">
                            <input type="hidden" class="user-id" value="${user.id}">
                            <img src="/storage/images/other_images/${user.profile_pic_path}" class="user-profile-pic" data-mssg="first-block">
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
                            No pic
                        </div>

                        <button class="cancel-friend-request-btn">cancel request</button>
                    `;
                } else if (user.profile_pic_path == 'none' && user.gender == 'female') {
                    userCard.innerHTML = `
                        <div style="display:flex; gap:1rem; align-items:center;">
                            <input type="hidden" class="user-id" value="${user.id}">
                            <img src="/storage/images/other_images/female-pic.jpeg" class="user-profile-pic">
                            <h1>${user.name}</h1>
                            No pic
                        </div>

                        <button class="cancel-friend-request-btn">cancel request</button>
                    `;
                }
            } 
            else {
                console.log(`I HAVE NOT SENT A FRIEND REQUEST AND THEY HAVE NOT SENT ME ONE NEITHER, USER: ${user.name} FALSE`);
                if (user.profile_pic_path != 'none') {
                    userCard.innerHTML = `
                        <div style="display:flex; gap:1rem; align-items:center;">
                            <input type="hidden" class="user-id" value="${user.id}">
                            <img src="/storage/images/other_images/${user.profile_pic_path}" class="user-profile-pic" data-mssg="first-block">
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
                            No pic
                        </div>

                        <button class="add-friend-btn">Add friend</button>
                    `;
                } else if (user.profile_pic_path == 'none' && user.gender == 'female') {
                    userCard.innerHTML = `
                        <div style="display:flex; gap:1rem; align-items:center;">
                            <input type="hidden" class="user-id" value="${user.id}">
                            <img src="/storage/images/other_images/female-pic.jpeg" class="user-profile-pic">
                            <h1>${user.name}</h1>
                            No pic
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
    const dynamicSection = document.querySelector('.dynamic-section');
    dynamicSection.innerHTML = '';

    data.forEach(user => {
        const userCard = document.createElement('div');
        userCard.classList = 'user-card-received-request';

        userCard.innerHTML = `
            <div style="display:flex; gap:1rem; align-items:center;">
                <input type="hidden" class="user-id" value="${user.id}">
                <img src="/storage/images/other_images/${user.profile_pic_path}" class="user-profile-pic" data-mssg="first-block">
                <h1>${user.name}</h1>
            </div>

            <div>
                <button class="accept-friend-request-btn">confirm</button>
                <button class="delete-friend-request-btn">delete</button>
            </div>
        `;

        dynamicSection.appendChild(userCard);
    })
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