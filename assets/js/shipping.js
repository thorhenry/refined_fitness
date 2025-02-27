document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab-btn');
    const categories = document.querySelectorAll('.shipping-category');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show selected category
            categories.forEach(cat => {
                cat.classList.remove('active');
                if (cat.id === `${category}-shipping`) {
                    cat.classList.add('active');
                }
            });
        });
    });
});