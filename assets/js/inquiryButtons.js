document.addEventListener('DOMContentLoaded', function() {
    // Handle all "SEND INQUIRY NOW" buttons
    document.querySelectorAll('.buy-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product details from the card
            const card = this.closest('.equipment-card');
            const model = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').textContent;
            const description = card.querySelector('.description').textContent;
            
            // Store details in sessionStorage
            sessionStorage.setItem('inquiryModel', model);
            sessionStorage.setItem('inquiryPrice', price);
            sessionStorage.setItem('inquiryDescription', description);
            
            // Redirect to inquiry page
            window.location.href = 'inquiry.html';
        });
    });
});