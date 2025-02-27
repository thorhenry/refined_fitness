// Add this at the beginning of your script file
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        menuBtn.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

const swiper = new Swiper('.swiper', {
    loop: true,
    speed: 2000,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    grabCursor: true,
    parallax: true,
    keyboard: {
        enabled: true,
    },
    mousewheel: {
        invert: false,
    },
    slidesPerView: 1,
    watchSlidesProgress: true,
    virtualTranslate: true,
    on: {
        init: function() {
            document.querySelector('.swiper').style.opacity = 1;
        },
        beforeTransitionStart: function() {
            const activeSlide = this.slides[this.activeIndex];
            const nextSlide = this.slides[this.activeIndex + 1];
            
            if (activeSlide && nextSlide) {
                activeSlide.style.transition = 'opacity 2s ease-in-out';
                nextSlide.style.transition = 'opacity 2s ease-in-out';
            }
        }
    }
});

// Add smooth scroll for button clicks
document.querySelectorAll('.nav-button').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        
        // Add exit animation
        document.body.style.opacity = 0;
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            window.location.href = href;
        }, 500);
    });
});

// Add entrance animation
window.addEventListener('load', () => {
    document.body.style.opacity = 1;
    document.body.style.transition = 'opacity 0.5s ease';
});
