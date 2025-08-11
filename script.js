// Hero Slider Functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;

// Auto-slide interval
let slideInterval;

// Initialize slider
function initSlider() {
    if (slides.length > 0) {
        showSlide(0);
        startAutoSlide();
    }
}

// Show specific slide
function showSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Add active class to current slide and dot
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    if (dots[index]) {
        dots[index].classList.add('active');
    }

    currentSlideIndex = index;
}

// Next slide
function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    showSlide(currentSlideIndex);
}

// Previous slide
function prevSlide() {
    currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    showSlide(currentSlideIndex);
}

// Change slide (called by navigation buttons)
function changeSlide(direction) {
    stopAutoSlide();
    if (direction === 1) {
        nextSlide();
    } else {
        prevSlide();
    }
    startAutoSlide();
}

// Go to specific slide (called by dots)
function currentSlide(index) {
    stopAutoSlide();
    showSlide(index - 1); // Convert to 0-based index
    startAutoSlide();
}

// Start auto-slide
function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

// Stop auto-slide
function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

// Pause auto-slide on hover
function setupSliderHover() {
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }
}

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        stopAutoSlide();
        if (diff > 0) {
            // Swipe left - next slide
            nextSlide();
        } else {
            // Swipe right - previous slide
            prevSlide();
        }
        startAutoSlide();
    }
}

// Setup touch events
function setupTouchEvents() {
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
        sliderContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
}

// Keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        }
    });
}

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Initialize slider
    initSlider();
    setupSliderHover();
    setupTouchEvents();
    setupKeyboardNavigation();
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Fade in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Add staggered animation for service cards
                if (entry.target.classList.contains('service-card')) {
                    const delay = entry.target.dataset.aosDelay || 0;
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.opacity = '1';
                    }, delay);
                }
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.service-card, .feature-item, .contact-item, .additional-service');
    fadeElements.forEach(el => {
        el.classList.add('fade-in');

        // Set initial state for service cards
        if (el.classList.contains('service-card')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
        }

        observer.observe(el);
    });

    // Emergency call tracking
    const emergencyButtons = document.querySelectorAll('a[href^="tel:"]');
    emergencyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Track emergency call clicks (you can integrate with analytics)
            console.log('Emergency call initiated');

            // Optional: Show confirmation dialog
            if (this.classList.contains('emergency-btn')) {
                const confirmed = confirm('You are about to call KHALSA AMBULANCE SERVICE Services emergency line. Continue?');
                if (!confirmed) {
                    event.preventDefault();
                }
            }
        });
    });

    // WhatsApp button tracking
    const whatsappButtons = document.querySelectorAll('a[href^="https://wa.me/"]');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('WhatsApp contact initiated');
        });
    });

    // Form validation and submission
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Basic validation
            if (!data.name || !data.phone || !data.pickup || !data.destination) {
                showAlert('Please fill in all required fields.', 'error');
                return;
            }

            // Phone number validation
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(data.phone.replace(/\D/g, '').slice(-10))) {
                showAlert('Please enter a valid 10-digit phone number.', 'error');
                return;
            }

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading"></span> Booking...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Create WhatsApp message
                const message = `Hello, I need ambulance service.

Name: ${data.name}
Phone: ${data.phone}
Pickup Location: ${data.pickup}
Destination: ${data.destination}
Ambulance Type: ${data.ambulanceType}
${data.notes ? `Additional Notes: ${data.notes}` : ''}

Please confirm availability and provide estimated time.`;

                const whatsappUrl = `https://wa.me/917987185955?text=${encodeURIComponent(message)}`;

                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                // Show success message
                showAlert('Booking request prepared! You will be redirected to WhatsApp to complete your booking.', 'success');

                // Redirect to WhatsApp after 2 seconds
                setTimeout(() => {
                    window.open(whatsappUrl, '_blank');
                }, 2000);

                // Reset form
                this.reset();
            }, 2000);
        });
    }

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Basic validation
            if (!data.name || !data.email || !data.message) {
                showAlert('Please fill in all required fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showAlert('Please enter a valid email address.', 'error');
                return;
            }

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading"></span> Sending...';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                showAlert('Thank you for your message! We will get back to you soon.', 'success');
                this.reset();
            }, 2000);
        });
    }

    // Scroll to top functionality
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 120px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #dc2626;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 998;
        box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
    `;

    document.body.appendChild(scrollToTopBtn);

    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Image lazy loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Add click tracking for analytics (optional)
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a, button');
        if (target) {
            const action = target.textContent.trim() || target.title || target.className;
            console.log('User interaction:', action);

            // You can integrate with Google Analytics or other tracking services here
            // gtag('event', 'click', { 'event_category': 'engagement', 'event_label': action });
        }
    });
});

// Utility function to show alerts
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());

    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; font-size: 18px; cursor: pointer;">&times;</button>
    `;

    // Insert at the top of the main content
    const main = document.querySelector('main') || document.querySelector('.hero') || document.body;
    main.insertBefore(alert, main.firstChild);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// Emergency contact functions
function callEmergency() {
    window.location.href = 'tel:07987185955';
}

function whatsappEmergency() {
    const message = 'Hello, I need emergency ambulance service. Please respond immediately.';
    window.open(`https://wa.me/917987185955?text=${encodeURIComponent(message)}`, '_blank');
}

// Booking shortcut function
function quickBooking() {
    window.location.href = 'book-ambulance.html';
}

// Service worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Performance monitoring
window.addEventListener('load', function() {
    // Log page load time
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log('Page load time:', loadTime + 'ms');

    // You can send this data to analytics
    // gtag('event', 'timing_complete', { 'name': 'load', 'value': loadTime });
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You can send error reports to a logging service
});

// Keyboard accessibility
document.addEventListener('keydown', function(e) {
    // Emergency hotkey (Ctrl + E)
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        callEmergency();
    }

    // Quick booking hotkey (Ctrl + B)
    if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        quickBooking();
    }
});

// Print functionality
function printPage() {
    window.print();
}

// Share functionality
function shareWebsite() {
    if (navigator.share) {
        navigator.share({
            title: 'KHALSA AMBULANCE SERVICE Services',
            text: 'Chhattisgarh\'s No.1 Ambulance Service - 24x7 Emergency Medical Services',
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showAlert('Website URL copied to clipboard!', 'success');
        });
    }
}
