document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.equipment-showcase');
    
    sections.forEach((section, index) => {
        const container = section.querySelector('.equipment-grid');
        const prevBtn = section.querySelector('.prev-btn');
        const nextBtn = section.querySelector('.next-btn');
        
        if (container && prevBtn && nextBtn) {
            const cardWidth = container.querySelector('.equipment-card').offsetWidth + 24;

            nextBtn.addEventListener('click', () => {
                container.scrollBy({
                    left: cardWidth,
                    behavior: 'smooth'
                });
            });
            
            prevBtn.addEventListener('click', () => {
                container.scrollBy({
                    left: -cardWidth,
                    behavior: 'smooth'
                });
            });

            container.addEventListener('scroll', () => {
                prevBtn.style.display = container.scrollLeft <= 0 ? 'none' : 'flex';
                nextBtn.style.display = 
                    container.scrollLeft >= (container.scrollWidth - container.clientWidth) 
                    ? 'none' 
                    : 'flex';
            });

            prevBtn.style.display = 'none';
        }
    });
});