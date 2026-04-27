
// COMMONLY USED FUNCTION.
function _(element) {
    return document.querySelector(element);
}
    
// LOGOUT POPUP CODE.

// Function to add the "show" class to logout popup element, when this element has this class, popup becomes visible and interactable.
function toggleLogoutPopup() {
    const logoutPopupWrapper = _('.logout-popup-wrapper');
    logoutPopupWrapper.classList.toggle('show');
    console.log('wwwwwww');
}


// If user clicks logout button, logout popup will show up.
const logoutBtn = _('.logout-btn'); 
logoutBtn.addEventListener('click', toggleLogoutPopup);
const bottomLogoutBtn = _('.bottom-logout-btn');
bottomLogoutBtn.addEventListener('click', toggleLogoutPopup);


// If user clicks the "No" button (when popup shows up), the logout popup will disappear.
const closeLogoutPopupBtn = _('.logout-opt-no');
closeLogoutPopupBtn.addEventListener('click', toggleLogoutPopup);



// If user clicks on logout popup background (outside popup asking if you really wanna logout), the popup will disappear.
document.addEventListener('click', e => {
    if (e.target.matches('.logout-popup-wrapper')) {
        toggleLogoutPopup();
    }
})





// CODE TO GET POSTS AND THEN DISPLAY THEM

function get_posts() {
    fetch('/get-posts')
    .then(res => {
        if (!res.ok) {
            throw new Error('Bad response when trying to get posts:', res.status);
        } else {
            return res.json();
        }
    })
    .then(data => {
        if(data.success) {
            console.log('posts were returned');
        }
    })
    .catch(err => console.log(err));
}

get_posts();