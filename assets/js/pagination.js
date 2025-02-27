function updatePagination(containerId) {
    const container = document.getElementById(containerId);
    const items = container.getElementsByClassName('equipment-card');
    const itemsPerPage = 9;
    const totalPages = Math.ceil(items.length / itemsPerPage);
    
    // Find the pagination container for this section
    const paginationContainer = container.closest('section').querySelector('.pagination');
    paginationContainer.innerHTML = '';
    
    // Only create pagination if there are more than itemsPerPage items
    if (items.length > itemsPerPage) {
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.className = 'page-btn' + (i === 1 ? ' active' : '');
            button.setAttribute('data-page', i);
            button.textContent = i;
            button.onclick = () => changePage(i, containerId);
            paginationContainer.appendChild(button);
        }
    }
}

function changePage(page, containerId) {
    const container = document.getElementById(containerId);
    const items = container.getElementsByClassName('equipment-card');
    const itemsPerPage = 9;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    
    // Update items visibility
    Array.from(items).forEach((item, index) => {
        item.style.display = (index >= start && index < end) ? 'block' : 'none';
    });
    
    // Update active button
    const buttons = container.closest('section').querySelectorAll('.page-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    container.closest('section').querySelector(`[data-page="${page}"]`).classList.add('active');
}

function initializePagination() {
    const sections = document.querySelectorAll('.equipment-showcase');
    
    sections.forEach(section => {
        const grid = section.querySelector('.equipment-grid');
        const items = grid.querySelectorAll('.equipment-card');
        const pagination = section.querySelector('.pagination');
        const itemsPerPage = 9;
        const totalItems = items.length;
        const pageCount = Math.ceil(totalItems / itemsPerPage);

        // Clear existing pagination
        pagination.innerHTML = '';

        if (totalItems > 0) {
            for (let i = 1; i <= pageCount; i++) {
                const button = document.createElement('button');
                button.className = 'page-btn' + (i === 1 ? ' active' : '');
                button.setAttribute('data-page', i);
                button.textContent = i;
                
                button.addEventListener('click', () => {
                    const isLastPage = i === pageCount;
                    const itemsOnThisPage = isLastPage ? 
                        totalItems - (pageCount - 1) * itemsPerPage : 
                        itemsPerPage;
                    
                    changePage(i, grid, section, itemsOnThisPage);
                });
                pagination.appendChild(button);
            }

            // Show pagination only if there's more than one page
            pagination.style.display = pageCount > 1 ? 'flex' : 'none';
        }

        // Initialize first page
        changePage(1, grid, section, Math.min(itemsPerPage, totalItems));
    });
}

function changePage(page, grid, section, itemsOnPage) {
    const items = grid.querySelectorAll('.equipment-card');
    const itemsPerPage = 9;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsOnPage;

    // Hide all items first
    items.forEach(item => item.style.display = 'none');

    // Show only items for current page
    for (let i = start; i < end; i++) {
        if (items[i]) {
            items[i].style.display = 'block';
        }
    }

    // Update active button
    const buttons = section.querySelectorAll('.page-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    section.querySelector(`[data-page="${page}"]`).classList.add('active');

    // Scroll to section
    scrollToSection(section);
}

function scrollToSection(section, itemCount) {
    const headerOffset = 120;
    const elementPosition = section.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePagination);