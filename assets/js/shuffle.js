document.addEventListener('DOMContentLoaded', function() {
    // Get all equipment cards
    const container = document.querySelector('.equipment-grid');
    const cards = Array.from(container.getElementsByClassName('equipment-card'));
    
    // Fisher-Yates shuffle algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i].cloneNode(true);
            array[i].replaceWith(array[j].cloneNode(true));
            array[j].replaceWith(temp);
        }
    }

    // Perform the shuffle
    shuffleArray(cards);

    // Add click event listeners to the newly shuffled buy buttons
    document.querySelectorAll('.buy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.equipment-card');
            const productName = card.querySelector('h3').textContent;
            const productDesc = card.querySelector('.description').textContent;
            sendInquiry(productName, productDesc);
        });
    });
});

// Preserve the inquiry functionality
function sendInquiry(productName, productDesc) {
    const message = `Product Inquiry:\nProduct: ${productName}\nDescription: ${productDesc}`;
    // Your existing inquiry handling code
}