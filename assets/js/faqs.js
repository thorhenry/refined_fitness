document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabs = document.querySelectorAll('.tab-btn');
    const categories = document.querySelectorAll('.faq-category');
    const faqItems = document.querySelectorAll('.faq-item');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show selected category
            categories.forEach(cat => {
                cat.classList.remove('active');
                if (cat.id === `${category}-faqs`) {
                    cat.classList.add('active');
                }
            });
        });
    });

    // FAQ accordion functionality
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Toggle current item
            if (!isOpen) {
                item.classList.add('active');
            }
        });
    });

    // Search functionality
    const searchInput = document.getElementById('faqSearch');
    const noResultsMessage = document.createElement('div');
    noResultsMessage.className = 'no-results';
    noResultsMessage.textContent = 'No matching questions found';
    noResultsMessage.style.display = 'none';
    document.querySelector('.faq-content').appendChild(noResultsMessage);

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        let hasResults = false;

        // Show all categories during search
        categories.forEach(cat => {
            cat.style.display = searchTerm ? 'block' : '';
            cat.classList.toggle('active', searchTerm !== '');
        });

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
            
            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = '';
                item.closest('.faq-group').style.display = '';
                hasResults = true;
                
                if (searchTerm) {
                    highlightText(item, searchTerm);
                } else {
                    removeHighlight(item);
                }
            } else {
                item.style.display = 'none';
            }
        });

        // Show/hide no results message
        noResultsMessage.style.display = hasResults ? 'none' : 'block';

        // Reset to original category view if search is empty
        if (!searchTerm) {
            resetCategories();
        }

        updateGroupVisibility();
    });

    function resetCategories() {
        const activeTab = document.querySelector('.tab-btn.active');
        categories.forEach(cat => {
            cat.classList.remove('active');
            cat.style.display = '';
            if (cat.id === `${activeTab.dataset.category}-faqs`) {
                cat.classList.add('active');
            }
        });
        
        faqItems.forEach(item => {
            item.style.display = '';
            removeHighlight(item);
        });
    }

    function updateGroupVisibility() {
        document.querySelectorAll('.faq-group').forEach(group => {
            const hasVisibleItems = Array.from(group.querySelectorAll('.faq-item'))
                .some(item => item.style.display !== 'none');
            group.style.display = hasVisibleItems ? '' : 'none';
        });
    }

    function highlightText(item, searchTerm) {
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const questionText = item.querySelector('.faq-question h3').textContent;
        const answerText = item.querySelector('.faq-answer p').textContent;

        item.querySelector('.faq-question h3').innerHTML = questionText.replace(
            regex, '<span class="highlight">$1</span>'
        );
        item.querySelector('.faq-answer p').innerHTML = answerText.replace(
            regex, '<span class="highlight">$1</span>'
        );
    }

    function removeHighlight(item) {
        const question = item.querySelector('.faq-question h3');
        const answer = item.querySelector('.faq-answer p');
        
        question.innerHTML = question.textContent;
        answer.innerHTML = answer.textContent;
    }
    // Show/hide FAQ groups based on visible items
    document.querySelectorAll('.faq-group').forEach(group => {
        const hasVisibleItems = Array.from(group.querySelectorAll('.faq-item'))
            .some(item => item.style.display !== 'none');
        group.style.display = hasVisibleItems ? 'block' : 'none';
    }); // Close DOMContentLoaded event listener
});
