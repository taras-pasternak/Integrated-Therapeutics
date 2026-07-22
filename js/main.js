document.addEventListener('DOMContentLoaded', () => {
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
                    if (totalScroll > 0) {
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
                if (indicatorContainer) {
                    if (activeId === 'hero' || activeId === 'contact') {
                        indicatorContainer.classList.add('theme-dark-bg');
                    } else {
                        indicatorContainer.classList.remove('theme-dark-bg');
                    }
                }

                document.querySelectorAll('.scroll-dot').forEach(dot => {
                    if (dot.dataset.target === activeId) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
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
        
        // 2rem is the sticky top of the heading. Get 1rem in px:
        const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const headingStickyTop = 2 * remPx;
        
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
});
