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
        { id: 'category-04', photoId: 'photo-04' } // Reviews section
    ];

    // Ensure first photo is visible initially
    const firstPhoto = document.getElementById('photo-01');
    if (firstPhoto) firstPhoto.classList.add('show');

    let activeLineObserver;

    function initScrollLogic() {
        if (activeLineObserver) {
            activeLineObserver.disconnect();
        }

        const windowHeight = window.innerHeight;
        const heading = document.querySelector('.approach-heading-wrapper');
        
        // 2rem is the sticky top of the heading. Get 1rem in px:
        const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const headingStickyTop = 2 * remPx;
        
        let headingHeight = 100;
        if (heading) {
            headingHeight = heading.getBoundingClientRect().height;
        }
        
        // Calculate where the Services text should stick: 72px below the heading
        const servicesStickyTop = headingStickyTop + headingHeight + 72;
        document.documentElement.style.setProperty('--services-sticky-top', `${servicesStickyTop}px`);

        // Calculate where the Biography text should stick: pinned to bottom of viewport
        const biographyText = document.querySelector('.approach-text');
        let biographyTop = servicesStickyTop; // fallback
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

        // We use a horizontal line exactly at the servicesStickyTop position for transitions
        const bottomMargin = -(windowHeight - servicesStickyTop - 1);
        const rootMargin = `-${servicesStickyTop}px 0px ${bottomMargin}px 0px`;

        activeLineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const wrapper = entry.target;
                const textContent = wrapper.querySelector('.approach-text, .services-text');
                const sectionConfig = sections.find(s => s.id === wrapper.id);
                
                if (entry.isIntersecting) {
                    // Fade IN text
                    if (textContent) {
                        textContent.classList.add('in-view');
                        textContent.classList.remove('out-view');
                    }
                    
                    // Switch photo
                    if (sectionConfig && sectionConfig.photoId) {
                        document.querySelectorAll('.photo').forEach(p => {
                            if (p.id !== sectionConfig.photoId) {
                                p.classList.remove('show');
                                p.classList.add('hide');
                            }
                        });
                        
                        const targetPhoto = document.getElementById(sectionConfig.photoId);
                        if (targetPhoto) {
                            targetPhoto.classList.remove('hide');
                            targetPhoto.classList.add('show');
                        }
                    }
                } else {
                    // Fade OUT text
                    if (textContent) {
                        textContent.classList.remove('in-view');
                        textContent.classList.add('out-view');
                    }
                }
            });
        }, { 
            rootMargin: rootMargin, 
            threshold: 0 
        });

        // Observe all wrappers
        sections.forEach(s => {
            const el = document.getElementById(s.id);
            if (el) {
                activeLineObserver.observe(el);
            }
        });
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
