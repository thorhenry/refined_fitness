document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const equipmentSections = document.querySelectorAll('.equipment-showcase');
    let searchTimeout;

    // Add search input event listener with debouncing
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase().trim();
            performSearch(searchTerm);
        }, 300);
    });

    function performSearch(searchTerm) {
        let totalVisibleCards = 0;

        equipmentSections.forEach(section => {
            const equipmentGrid = section.querySelector('.equipment-grid');
            const cards = Array.from(section.querySelectorAll('.equipment-card'));
            let hasVisibleCards = false;

            cards.forEach(card => {
                const title = card.querySelector('h3');
                const description = card.querySelector('.description');
                const model = title.textContent.toLowerCase();

                const isMatch = model.includes(searchTerm) || 
                              description.textContent.toLowerCase().includes(searchTerm);

                if (isMatch) {
                    card.style.display = 'flex';
                    card.style.flexDirection = 'column';
                    hasVisibleCards = true;
                    totalVisibleCards++;
                    
                    title.style.display = 'block';
                    description.style.display = 'block';
                    
                    title.style.margin = '10px 0';
                    description.style.margin = '5px 0';
                } else {
                    card.style.display = 'none';
                }
            });

            section.style.display = hasVisibleCards ? 'block' : 'none';
            const sectionHeader = section.querySelector('.container-header');
            sectionHeader.style.display = hasVisibleCards ? 'block' : 'none';
        });

        // Show/hide no results message
        const noResultsDiv = document.querySelector('.no-results') || createNoResultsDiv();
        noResultsDiv.style.display = (searchTerm && totalVisibleCards === 0) ? 'block' : 'none';

        // Update pagination visibility
        document.querySelectorAll('.pagination').forEach(pagination => {
            pagination.style.display = searchTerm ? 'none' : 'flex';
        });
    }

    function createNoResultsDiv() {
        const div = document.createElement('div');
        div.className = 'no-results';
        div.innerHTML = `
            <div class="no-results-content">
                <i class="fas fa-dumbbell"></i>
                <h3>No Equipment Found</h3>
                <p>Try adjusting your search term</p>
            </div>
        `;
        div.style.cssText = `
            text-align: center;
            padding: 40px;
            margin: 20px auto;
            background: #f8f9fa;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            max-width: 400px;
        `;
    
        const iconStyle = `
            font-size: 40px;
            color: #274fae;
            margin-bottom: 15px;
            opacity: 0.7;
        `;
    
        const h3Style = `
            font-family: 'Raleway', sans-serif;
            font-size: 24px;
            color: #333;
            margin: 10px 0;
        `;
    
        const pStyle = `
            font-family: 'Raleway', sans-serif;
            font-size: 16px;
            color: #666;
            margin: 5px 0;
        `;
    
        div.querySelector('i').style.cssText = iconStyle;
        div.querySelector('h3').style.cssText = h3Style;
        div.querySelector('p').style.cssText = pStyle;
    
        document.querySelector('.equipment-section').appendChild(div);
        return div;
    }

    // Reset search and show all sections
    searchInput.addEventListener('search', function() {
        if (this.value === '') {
            equipmentSections.forEach(section => {
                section.style.display = 'block';
            });
            performSearch('');
        }
    });
});