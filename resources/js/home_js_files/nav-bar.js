


// COMMONLY USED FUNCTION.
function _(element) {
    return document.querySelector(element);
}
    
/////////////////////
// LOGOUT POPUP CODE.
/////////////////////

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




