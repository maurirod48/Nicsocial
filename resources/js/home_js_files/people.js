console.log('people sectiooooonnnn!!');
function _(element) {
    return document.querySelector(element);
}

// Code to get all users and display them.

let people;
let friends;

// function to get all users except the one who's currently logged in (cuz why would we need to display that user in this section?).
function getPeople() {
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
    console.log('friends');
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

// DISPLAY PEOPLE CODE.

function displayPeople(people) {
    const dynamicSection = _('.dynamic-section');

    dynamicSection.innerHTML = '';

    people.forEach(user => {
        const userCard = document.createElement('div');
        userCard.classList = "user-card";


        if (user.profile_pic_path != null) {
            userCard.innerHTML = `
                <div style="display:flex; gap:1rem; align-items:center;">
                    <img src="/storage/images/other_images/${user.profile_pic_path}" class="user-profile-pic" data-mssg="first-block">
                    <h1>${user.name}</h1>
                </div>

                <button class="add-friend-btn">Add friend</button>
            `;
        } else if (user.profile_pic_path == null) {
            userCard.innerHTML = `
                <div style="display:flex; gap:1rem; align-items:center;">
                    <img src="/storage/images/other_images/male-pic.jpg" class="user-profile-pic">
                    <h1>${user.name}</h1>
                    No pic
                </div>

                <button class="add-friend-btn">Add friend</button>
            `;
        }
        
        dynamicSection.appendChild(userCard);
    })
}