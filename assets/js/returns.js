document.addEventListener('DOMContentLoaded', function() {
    const returnForm = document.getElementById('returnForm');
    const submitBtn = document.querySelector('.submit-btn');
    const orderInput = document.getElementById('orderNumber');

    // Add input validation for order number
    orderInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 14);
    });

    returnForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        const formData = {
            orderNumber: document.getElementById('orderNumber').value,
            reason: document.getElementById('reason').value,
            comments: document.getElementById('comments').value
        };

        if (!validateForm(formData)) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Return Request';
            return;
        }

        setTimeout(() => {
            showConfirmation(formData);
            returnForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Return Request';
        }, 1500);
    });

    function validateForm(data) {
        if (!data.orderNumber || data.orderNumber.length !== 14) {
            showError('Please enter a valid digit order number');
            return false;
        }
        if (!data.reason) {
            showError('Please select a reason for return');
            return false;
        }
        return true;
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const existingError = returnForm.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        returnForm.insertBefore(errorDiv, submitBtn);
        setTimeout(() => errorDiv.remove(), 3000);
    }

    function showConfirmation(data) {
        const confirmationDiv = document.createElement('div');
        confirmationDiv.className = 'confirmation-message';
        confirmationDiv.innerHTML = `
            <h3>Return Request Submitted</h3>
            <p>We've received your return request for order #${data.orderNumber}.</p>
            <p>You will receive a confirmation email with further instructions shortly.</p>
            <p class="tracking-note">Your return tracking number will be sent to your email.</p>
        `;

        const formContainer = returnForm.parentElement;
        formContainer.innerHTML = '';
        formContainer.appendChild(confirmationDiv);
    }

    // Add tab switching functionality
    const tabs = document.querySelectorAll('.tab-btn');
    const categories = document.querySelectorAll('.policy-category');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show selected category
            categories.forEach(cat => {
                cat.classList.remove('active');
                if (cat.id === `${category}-policy`) {
                    cat.classList.add('active');
                }
            });
        });
    });
});