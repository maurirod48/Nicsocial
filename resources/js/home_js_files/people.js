

// console.log('people sectiooooonnnn!!');
function _(element) {
    return document.querySelector(element);
}

// CSRF token.
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

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

// DISPLAY FRIENDS CODE.
function displayFriends(friends) {
    const dynamicSection = _('.dynamic-section');

    dynamicSection.innerHTML = '';
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

// DISPLAY PEOPLE CODE.

async function displayPeople(people) {
    const dynamicSection = _('.dynamic-section');

    // clearing dynamic view.
    dynamicSection.innerHTML = '';

    // get all friend requests instances.

    friendRequests = await getFriendRequestInstances();
    console.log('friend requests array data:', friendRequests);

    // creating user card for each user.
    people.forEach(user => {
        const userCard = document.createElement('div');
        userCard.classList = "user-card";


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
        
        // adding user card to dynamic section.
        dynamicSection.appendChild(userCard);
    })
}

// SEND FRIEND REQUEST CODE.

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