/* ============================================================
   BIMALA TRADING — Main JavaScript Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    const html = document.documentElement;
    const navbar = document.getElementById('navbar');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            html.setAttribute('data-theme', newTheme);
            themeIcon.innerText = newTheme === 'dark' ? '☀️' : '🌙';
            themeText.innerText = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';

            // Update navbar blur background
            if (navbar) {
                navbar.style.background = newTheme === 'dark' ? 'rgba(13, 17, 23, 0.8)' : 'rgba(255, 255, 255, 0.8)';
            }
        });
    }

    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Trigger counter animation if it's a stats item
                if (entry.target.querySelector('.stat-number')) {
                    animateCounters(entry.target);
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // --- Counter Animation ---
    function animateCounters(container) {
        const counters = container.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            if (counter.dataset.animated) return;
            counter.dataset.animated = "true";

            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const increment = target / (duration / 16);

            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current) + "+";
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target + "+";
                }
            };
            updateCounter();
        });
    }

    // --- Hero Parallax Effect ---
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
        }
    });

    // --- Smooth Navbar Transition ---
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (nav) {
            if (window.scrollY > 50) {
                nav.style.padding = '0';
                nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            } else {
                nav.style.padding = '10px 0';
                nav.style.boxShadow = 'none';
            }
        }
    });

    // --- Mouse Glow Effect ---
    const glow = document.getElementById('mouse-glow');
    if (glow) {
        window.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
    }

    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'Sending...';
            }

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    if (formStatus) {
                        formStatus.style.display = 'block';
                        formStatus.style.background = 'rgba(76, 175, 80, 0.1)';
                        formStatus.style.color = '#4CAF50';
                        formStatus.innerText = 'Thank you! Your message has been sent successfully.';
                    }
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                if (formStatus) {
                    formStatus.style.display = 'block';
                    formStatus.style.background = 'rgba(244, 67, 54, 0.1)';
                    formStatus.style.color = '#F44336';
                    formStatus.innerText = 'Oops! There was a problem sending your message. Please try again.';
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'Send Inquiry';
                }
            }
        });
    }
});
