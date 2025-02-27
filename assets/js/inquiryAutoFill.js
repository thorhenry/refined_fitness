document.addEventListener('DOMContentLoaded', function() {
    // Get the stored model information
    const model = sessionStorage.getItem('equipmentModel');
    
    if (model) {
        // Find the equipment model input field and set its value
        const equipmentInput = document.querySelector('#equipment');
        if (equipmentInput) {
            equipmentInput.value = model;
        }

        // Clear the storage
        sessionStorage.removeItem('equipmentModel');
    }
});