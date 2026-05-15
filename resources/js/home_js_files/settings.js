
// Function to grab elements.
function _(element) {
    return document.querySelector(element);
}

//====================
// DELETE ACCOUNT CODE
//====================

// Delete button.
document.addEventListener('click', (e) => {
    if (e.target.matches('.delete-account-btn')) {
        toggleDeleteConfirmationButtons();
    }
});

// Cancel button.
document.addEventListener('click', (e) => {
    if (e.target.matches('.cancel-btn')) {
        toggleDeleteConfirmationButtons();
    }
});

function toggleDeleteConfirmationButtons() {
    const dropdown = _('.delete-dropdown-container');
    dropdown.classList.toggle('show');
    console.log('clicked');
}

//====================
// CHANGE PASSWORD CODE
//====================

const errorOkBtn = _('.errors-ok-btn');

errorOkBtn.addEventListener('click', toggleErrorPopup);

function toggleErrorPopup() {
    
    const errorsPopupContainer = _('.errors-wrapper');
    errorsPopupContainer.classList.add('hide');
}