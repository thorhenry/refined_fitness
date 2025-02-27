document.addEventListener('DOMContentLoaded', function() {
    // For the projects page: handle inquiry button clicks
    const inquiryButtons = document.querySelectorAll('.inquiry-btn');
    inquiryButtons.forEach((button) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const projectName = this.closest('.equipment-container')
                                  .querySelector('.container-header h2')
                                  .textContent;
            // Navigate to inquiry page with project name
            window.location.href = `inquiry.html?model=${encodeURIComponent(projectName.trim())}`;
        });
    });

    // For the inquiry page: auto-fill the equipment model
    if (window.location.pathname.includes('inquiry.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const projectName = urlParams.get('model');
        
        // Look for both possible IDs since forms might use either
        const modelInput = document.querySelector('#equipment-model, #model');
        if (projectName && modelInput) {
            modelInput.value = projectName;
            modelInput.setAttribute('readonly', true);
        }
    }
});