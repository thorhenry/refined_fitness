document.addEventListener('DOMContentLoaded', function() {
    const equipmentGrid = document.querySelector('.equipment-grid');
    const cards = Array.from(equipmentGrid.querySelectorAll('.equipment-card'));
    const paginationContainer = document.querySelector('.pagination');
    const itemsPerPage = 10;
    const totalPages = Math.ceil(cards.length / itemsPerPage);

    // Initialize pagination
    function initPagination() {
        paginationContainer.innerHTML = '';
        
        // Add previous button
        const prevButton = createPageButton('prev', '←');
        paginationContainer.appendChild(prevButton);

        // Create numbered buttons
        for (let i = 1; i <= totalPages; i++) {
            const button = createPageButton(i);
            paginationContainer.appendChild(button);
        }

        // Add next button
        const nextButton = createPageButton('next', '→');
        paginationContainer.appendChild(nextButton);

        // Show first page
        showPage(1);
    }

    function createPageButton(value, symbol = value) {
        const button = document.createElement('button');
        button.className = `page-btn ${value === 1 ? 'active' : ''}`;
        button.setAttribute('data-page', value);
        button.textContent = symbol;
        
        button.addEventListener('click', () => {
            const currentPage = parseInt(document.querySelector('.page-btn.active').getAttribute('data-page'));
            let targetPage;

            if (value === 'prev') {
                targetPage = Math.max(currentPage - 1, 1);
            } else if (value === 'next') {
                targetPage = Math.min(currentPage + 1, totalPages);
            } else {
                targetPage = value;
            }

            showPage(targetPage);
        });

        return button;
    }

    function showPage(pageNumber) {
        const start = (pageNumber - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        // Apply transitions to cards
        cards.forEach((card, index) => {
            card.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
            
            if (index >= start && index < end) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });

        // Update active button state
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-page') == pageNumber) {
                btn.classList.add('active');
            }
        });

        // Update prev/next button states
        const prevButton = document.querySelector('.page-btn[data-page="prev"]');
        const nextButton = document.querySelector('.page-btn[data-page="next"]');
        prevButton.disabled = pageNumber === 1;
        nextButton.disabled = pageNumber === totalPages;

        // Smooth scroll to top of equipment section
        document.querySelector('.equipment-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Initialize pagination
    initPagination();
});