// Carousel Gallery Functionality
document.addEventListener('DOMContentLoaded', function() {

    // Initialize all carousels
    const carousels = document.querySelectorAll('.carousel-container');

    carousels.forEach(carousel => {
        initCarousel(carousel);
    });

    function initCarousel(carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.querySelectorAll('.carousel-slide'));
        const dotsContainer = carousel.querySelector('.carousel-dots');

        let currentIndex = 0;
        let touchStartX = 0;
        let touchEndX = 0;

        // Create navigation dots
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.querySelectorAll('.carousel-dot'));

        function updateCarousel() {
            const slideWidth = slides[0].getBoundingClientRect().width;
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        }

        // Touch/Swipe support with better mobile handling
        let touchStartY = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        carousel.addEventListener('touchmove', (e) => {
            // Prevent pull-to-refresh if swiping horizontally
            const touchMoveX = e.changedTouches[0].screenX;
            const touchMoveY = e.changedTouches[0].screenY;
            const diffX = Math.abs(touchMoveX - touchStartX);
            const diffY = Math.abs(touchMoveY - touchStartY);

            // If horizontal swipe is more significant, prevent scroll
            if (diffX > diffY && diffX > 10) {
                e.preventDefault();
            }
        }, { passive: false });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchStartX - touchEndX > swipeThreshold) {
                nextSlide();
            }
            if (touchEndX - touchStartX > swipeThreshold) {
                prevSlide();
            }
        }

        // Mouse drag support (desktop)
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;

        carousel.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Prevent default image drag
            isDragging = true;
            startPos = e.pageX;
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const currentPosition = e.pageX;
            const diff = currentPosition - startPos;
            currentTranslate = prevTranslate + diff;
        });

        carousel.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;

            const movedBy = e.pageX - startPos;
            if (movedBy < -50) {
                nextSlide();
            } else if (movedBy > 50) {
                prevSlide();
            }

            prevTranslate = currentTranslate;
        });

        carousel.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
            }
        });

        // Prevent context menu on carousel
        carousel.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Keyboard navigation
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });

        // Make carousel focusable for keyboard navigation
        carousel.setAttribute('tabindex', '0');

        // Update on window resize
        window.addEventListener('resize', updateCarousel);

        // Initialize
        updateCarousel();
    }

    // Smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add entrance animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe gallery sections
    document.querySelectorAll('.gallery-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    console.log('Anna Rozen Golzman - Portfolio with Carousels loaded! 💅✨');
});
