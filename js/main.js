document.addEventListener('DOMContentLoaded', () => {
    // Interactive Title Font Weight (Mouse hover effect)
    const animatedTitles = document.querySelectorAll('.hero-title, .contact-title');
    if (animatedTitles.length > 0) {
        function wrapTextNodes(element) {
            const childNodes = Array.from(element.childNodes);
            childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent;
                    const chars = text.split('');
                    const fragment = document.createDocumentFragment();
                    chars.forEach(char => {
                        if (char === ' ') {
                            fragment.appendChild(document.createTextNode(' '));
                        } else {
                            const span = document.createElement('span');
                            span.className = 'hero-char';
                            span.textContent = char;
                            fragment.appendChild(span);
                        }
                    });
                    element.replaceChild(fragment, node);
                } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
                    wrapTextNodes(node);
                }
            });
        }
        
        animatedTitles.forEach(title => wrapTextNodes(title));

        const charsElements = document.querySelectorAll('.hero-char');
        
        let mouseX = 0;
        let mouseY = 0;
        let isHovering = false;
        let ticking = false;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isHovering = true;
            
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateHeroChars();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        document.addEventListener('mouseleave', () => {
            isHovering = false;
            updateHeroChars();
        });

        function updateHeroChars() {
            const effectRadius = 250; // Radius in pixels
            
            charsElements.forEach(char => {
                const isItalic = char.closest('.hero-italic') !== null;
                const baseWeight = isItalic ? 300 : 900;

                if (!isHovering) {
                    char.style.fontWeight = baseWeight;
                    return;
                }
                
                const rect = char.getBoundingClientRect();
                const charX = rect.left + rect.width / 2;
                const charY = rect.top + rect.height / 2;
                
                const distX = mouseX - charX;
                const distY = mouseY - charY;
                const distance = Math.sqrt(distX * distX + distY * distY);
                
                if (distance < effectRadius) {
                    const progress = distance / effectRadius;
                    const weight = 100 + (baseWeight - 100) * progress;
                    char.style.fontWeight = weight;
                } else {
                    char.style.fontWeight = baseWeight;
                }
            });
        }
    }

    // Scroll-driven animation for section headings (tracking and weight)
    const headings = document.querySelectorAll('.approach-title');
    if (headings.length > 0) {
        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            
            headings.forEach(heading => {
                const section = heading.closest('.approach-section');
                if (section) {
                    const rect = section.getBoundingClientRect();
                    // The total scroll distance while the section is on screen
                    const totalScroll = rect.height - windowHeight;
                    
                    let progress = 0;
                    if (window.innerWidth <= 767) {
                        const headingRect = heading.getBoundingClientRect();
                        // 0 at the bottom of the screen, 1 at the top
                        progress = 1 - (headingRect.top / windowHeight);
                        progress = Math.max(0, Math.min(1, progress));
                    } else if (totalScroll > 0) {
                        // Start animation when section hits top of viewport (rect.top <= 0)
                        const scrolled = -rect.top;
                        progress = scrolled / totalScroll;
                        progress = Math.max(0, Math.min(1, progress));
                    }
                    
                    // letter-spacing: -0.03em to 0.12em (wide tracking)
                    const tracking = -0.03 + (progress * 0.15);
                    // font-weight: 700 to 200 (thin)
                    const weight = 700 - (progress * 500);
                    
                    heading.style.letterSpacing = `${tracking}em`;
                    heading.style.fontWeight = weight;
                }
            });
        });
    }

    // Unified Scroll Observer for Text and Photos
    const sections = [
        { id: 'section-approach', photoId: 'photo-01' },
        { id: 'category-01', photoId: 'photo-02' },
        { id: 'category-02', photoId: 'photo-03' },
        { id: 'category-03', photoId: 'photo-04' },
        { id: 'category-04', photoId: 'photo-05' } // Reviews section
    ];

    // All sections including hero for scroll dots
    const allSections = [
        { id: 'hero' },
        ...sections,
        { id: 'contact' }
    ];

    // Create scroll indicators once
    const indicatorContainer = document.createElement('div');
    indicatorContainer.className = 'scroll-indicators';
    allSections.forEach((s) => {
        const dot = document.createElement('button');
        dot.className = 'scroll-dot';
        dot.dataset.target = s.id;
        dot.setAttribute('aria-label', `Go to ${s.id}`);
        dot.addEventListener('click', () => {
            const el = document.getElementById(s.id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        });
        indicatorContainer.appendChild(dot);
    });
    document.body.appendChild(indicatorContainer);

    // Section tabs smooth scroll
    document.querySelectorAll('.section-tabs .tab-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Global variables for scroll logic
    let appearLine = 0;
    let disappearLine = 0;
    let windowHeight = window.innerHeight;
    let servicesStickyTop = 0;
    let biographyTop = 0;
    
    // Extract the scroll logic into a single event listener to prevent stacking on resize
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                // Find active section for dots
                let activeId = 'hero';
                allSections.forEach(s => {
                    const el = document.getElementById(s.id);
                    if (!el) return;
                    const rect = el.getBoundingClientRect();
                    // If top of section is above the middle of screen, consider it active
                    if (rect.top <= windowHeight / 2) {
                        activeId = s.id;
                    }
                });

                // Update dots UI and container theme
                const indicatorContainer = document.querySelector('.scroll-indicators');
                const header = document.querySelector('.header');

                if (indicatorContainer) {
                    if (activeId === 'hero' || activeId === 'contact') {
                        indicatorContainer.classList.add('theme-dark-bg');
                    } else {
                        indicatorContainer.classList.remove('theme-dark-bg');
                    }
                }

                if (header) {
                    // hero and contact have dark backgrounds (need white logo)
                    // approach and services have white backgrounds (need black logo)
                    if (activeId === 'hero' || activeId === 'contact') {
                        header.classList.remove('header-inverted');
                    } else {
                        header.classList.add('header-inverted');
                    }
                }

                document.querySelectorAll('.scroll-dot').forEach(dot => {
                    if (dot.dataset.target === activeId) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });

                // Update section tabs
                document.querySelectorAll('.section-tabs .tab-link').forEach(link => {
                    const targetId = link.getAttribute('href').substring(1);
                    let isActive = false;
                    
                    if (targetId === 'section-approach' && activeId === 'section-approach') isActive = true;
                    if (targetId === 'category-01' && ['category-01', 'category-02', 'category-03'].includes(activeId)) isActive = true;
                    if (targetId === 'category-04' && activeId === 'category-04') isActive = true;
                    
                    if (isActive) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

                // Original logic for text and photos
                sections.forEach(s => {
                    const el = document.getElementById(s.id);
                    if (!el) return;
                    
                    const rect = el.getBoundingClientRect();
                    const textContent = el.querySelector('.approach-text, .services-text');
                    
                    // Text animation logic
                    if (textContent) {
                        let elStickyTop = servicesStickyTop;
                        if (s.id === 'section-approach') {
                            // Fetch dynamic custom property or fallback to JS variable
                            elStickyTop = biographyTop || servicesStickyTop;
                        }
                        
                        // Appear 100px before sticking, disappear 500px before pushing up
                        const elAppearLine = elStickyTop + 100;
                        const elDisappearLine = elStickyTop + 500;

                        if (rect.top <= elAppearLine && rect.bottom >= elDisappearLine) {
                            textContent.classList.add('in-view');
                            textContent.classList.remove('is-above', 'is-below');
                        } else if (rect.bottom < elDisappearLine) {
                            textContent.classList.remove('in-view', 'is-below');
                            textContent.classList.add('is-above');
                        } else if (rect.top > elAppearLine) {
                            textContent.classList.remove('in-view', 'is-above');
                            textContent.classList.add('is-below');
                        }
                    }
                    
                    // Photo switching logic
                    if (rect.top <= windowHeight/2 && rect.bottom >= windowHeight/2) {
                        if (s.photoId) {
                            document.querySelectorAll('.photo').forEach(p => {
                                if (p.id !== s.photoId) {
                                    p.classList.remove('show');
                                    p.classList.add('hide');
                                }
                            });
                            
                            const targetPhoto = document.getElementById(s.photoId);
                            if (targetPhoto) {
                                targetPhoto.classList.remove('hide');
                                targetPhoto.classList.add('show');
                                
                                // Calculate grayscale based on scroll progress of the section
                                // The section is active while rect.top <= windowHeight/2 AND rect.bottom >= windowHeight/2
                                // It starts at rect.top == windowHeight/2
                                // It ends at rect.bottom == windowHeight/2 (which means rect.top == windowHeight/2 - rect.height)
                                let sectionProgress = ((windowHeight / 2) - rect.top) / rect.height;
                                sectionProgress = Math.max(0, Math.min(1, sectionProgress));
                                
                                // We want it to start fully grayscale (1) and end fully colored (0)
                                let grayscaleProgress = 1.0 - sectionProgress;
                                
                                // Convert to percentage
                                targetPhoto.style.filter = `grayscale(${grayscaleProgress * 100}%)`;
                            }
                        }
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    });

    function initScrollLogic() {
        windowHeight = window.innerHeight;
        
        // Ensure first photo is visible initially
        const firstPhoto = document.getElementById('photo-01');
        if (firstPhoto) firstPhoto.classList.add('show');

        const heading = document.querySelector('.approach-heading-wrapper');
        
        // Get the actual sticky top of the heading from CSS (e.g. 150px)
        let headingStickyTop = 150; // default
        if (heading) {
            headingStickyTop = parseFloat(getComputedStyle(heading).top) || 150;
        }
        
        let headingHeight = 100;
        if (heading) {
            headingHeight = heading.getBoundingClientRect().height;
        }
        
        // Calculate where the Services text should stick: 72px below the heading
        servicesStickyTop = headingStickyTop + headingHeight + 72;
        document.documentElement.style.setProperty('--services-sticky-top', `${servicesStickyTop}px`);

        // Calculate where the Biography text should stick: pinned to bottom of viewport
        const biographyText = document.querySelector('.approach-text');
        biographyTop = servicesStickyTop; // fallback
        if (biographyText) {
            const textHeight = biographyText.getBoundingClientRect().height;
            // Pin to bottom: windowHeight - textHeight - 2rem (margin from bottom)
            biographyTop = windowHeight - textHeight - headingStickyTop;
            
            // Ensure it doesn't overlap the heading if the screen is too short
            if (biographyTop < servicesStickyTop) {
                biographyTop = servicesStickyTop;
            }
        }
        document.documentElement.style.setProperty('--biography-sticky-top', `${biographyTop}px`);

        // Decouple appear and disappear timings
        const appearOffset = 250; // Appear when 250px below sticky point
        const disappearOffset = 650; // Disappear 650px before being pushed up
        
        appearLine = servicesStickyTop + appearOffset;
        disappearLine = servicesStickyTop + disappearOffset;
        
        // Trigger once on load to set initial states
        window.dispatchEvent(new Event('scroll'));
    }

    // Initialize and listen to resize
    initScrollLogic();
    window.addEventListener('resize', initScrollLogic);
    
    // Crucial: Recalculate after fonts load to ensure heading height is correct!
    // Otherwise, the text sticks inside the heading.
    if (document.fonts) {
        document.fonts.ready.then(initScrollLogic);
    }
    window.addEventListener('load', initScrollLogic);

    // Form submission logic
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            formStatus.textContent = "Sending...";
            
            const data = new FormData(contactForm);
            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    formStatus.textContent = "Message sent successfully!";
                    contactForm.reset();
                    setTimeout(() => formStatus.textContent = "", 5000);
                } else {
                    const responseData = await response.json();
                    if (Object.hasOwn(responseData, 'errors')) {
                        formStatus.textContent = responseData["errors"].map(error => error["message"]).join(", ");
                    } else {
                        formStatus.textContent = "Oops! There was a problem submitting your form";
                    }
                }
            } catch (error) {
                formStatus.textContent = "Oops! There was a problem submitting your form";
            }
        });
    }

    // Hero Spotlight Effect
    const heroWrapper = document.getElementById('hero');
    const heroPlaceholder = document.querySelector('.hero-wrapper .background-placeholder');
    if (heroWrapper && heroPlaceholder) {
        heroWrapper.addEventListener('mousemove', (e) => {
            const rect = heroWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            heroPlaceholder.style.setProperty('--x', `${x}px`);
            heroPlaceholder.style.setProperty('--y', `${y}px`);
        });
    }

    // Contact Spotlight Effect
    const contactSection = document.getElementById('contact');
    const contactPlaceholder = document.querySelector('.contact-background-placeholder');
    if (contactSection && contactPlaceholder) {
        contactSection.addEventListener('mousemove', (e) => {
            const rect = contactSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            contactPlaceholder.style.setProperty('--x', `${x}px`);
            contactPlaceholder.style.setProperty('--y', `${y}px`);
        });
    }

    // Mobile Menu Toggle
    const btnMenu = document.querySelector('.btn-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
    const mobileDropdownMenu = document.querySelector('.mobile-dropdown-menu');
    const header = document.querySelector('.header');

    if (btnMenu && mobileNav) {
        btnMenu.addEventListener('click', () => {
            btnMenu.classList.toggle('active');
            mobileNav.classList.toggle('active');
            if (header) {
                header.classList.toggle('menu-open');
            }
            document.body.classList.toggle('menu-open');
        });

        // Close menu on link click
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                btnMenu.classList.remove('active');
                mobileNav.classList.remove('active');
                if (header) {
                    header.classList.remove('menu-open');
                }
                document.body.classList.remove('menu-open');
            });
        });
    }
});
