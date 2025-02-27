document.addEventListener('DOMContentLoaded', function() {
    const inquiryButtons = document.querySelectorAll('.buy-btn');

    inquiryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.equipment-card');
            const model = card.querySelector('h3').textContent;

            // Store only the model information
            sessionStorage.setItem('equipmentModel', model);

            // Redirect to inquiry page
            window.location.href = 'inquiry.html';
        });
    });
});