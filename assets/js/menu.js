document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Existing click handlers
    document.addEventListener('click', (e) => {
        if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Pagination functionality
    const sections = document.querySelectorAll('.equipment-showcase');
    
    sections.forEach(section => {
        const cards = section.querySelectorAll('.equipment-card');
        const paginationButtons = section.querySelectorAll('.page-btn');
        const itemsPerPage = 4;

        function showPage(pageNum) {
            const start = (pageNum - 1) * itemsPerPage;
            const end = start + itemsPerPage;

            cards.forEach((card, index) => {
                if (index >= start && index < end) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });

            paginationButtons.forEach(btn => {
                btn.classList.remove('active');
                if (parseInt(btn.dataset.page) === pageNum) {
                    btn.classList.add('active');
                }
            });
        }

        paginationButtons.forEach(button => {
            button.addEventListener('click', () => {
                const pageNum = parseInt(button.dataset.page);
                showPage(pageNum);
            });
        });

        // Show first page by default
        showPage(1);
    });
});