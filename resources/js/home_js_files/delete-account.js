
// Function to grab elements.
function _(element) {
    return document.querySelector(element);
}


// Delete button.
const deleteButton = _('.delete-account-btn');
deleteButton.addEventListener('click', toggleDeleteConfirmationButtons);

// Cancel button.
const cancelButton = _('.cancel-btn');
cancelButton.addEventListener('click', toggleDeleteConfirmationButtons);

function toggleDeleteConfirmationButtons() {
    const dropdown = _('.delete-dropdown-container');
    dropdown.classList.toggle('show');
    console.log('clicked');
}