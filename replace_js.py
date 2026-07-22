js_file = "/Users/pasternak/Documents/antigravity/Integrated/Integrated-Therapeutics/js/main.js"

with open(js_file, 'r') as f:
    content = f.read()

new_js = """    // --- Master Scrollytelling Controller ---
    const triggers = document.querySelectorAll('.scroll-trigger');
    const texts = document.querySelectorAll('.scrolly-text-block');
    
    // Map text index to corresponding heading ID
    const headings = {
        0: 'heading-approach',
        1: 'heading-services',
        2: 'heading-services',
        3: 'heading-services',
        4: 'heading-reviews'
    };
    
    // Map text index to corresponding photo ID
    const photos = {
        0: 'photo-01',
        1: 'photo-02',
        2: 'photo-03',
        3: 'photo-04',
        4: 'photo-04'
    };
    
    let currentIndex = 0;
    
    // Trigger when the middle of the trigger crosses the middle of the viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = parseInt(entry.target.getAttribute('data-index'));
                activateIndex(index);
            }
        });
    }, { rootMargin: "-50% 0px -49% 0px" });
    
    triggers.forEach(t => observer.observe(t));
    
    function activateIndex(newIndex) {
        if (newIndex === currentIndex) return;
        
        // Determine scroll direction for animation (optional, currently using simple out-up/out-down)
        const isScrollingDown = newIndex > currentIndex;
        
        // Deactivate old
        if (texts[currentIndex]) {
            texts[currentIndex].classList.remove('active');
            texts[currentIndex].classList.remove('out-up', 'out-down');
            texts[currentIndex].classList.add(isScrollingDown ? 'out-up' : 'out-down');
        }
        
        // Activate new
        if (texts[newIndex]) {
            texts[newIndex].classList.remove('out-up', 'out-down');
            texts[newIndex].classList.add('active');
        }
        
        // Update Heading
        document.querySelectorAll('.heading-layer').forEach(h => h.classList.remove('active'));
        if (headings[newIndex]) {
            document.getElementById(headings[newIndex]).classList.add('active');
        }
        
        // Update Photo
        document.querySelectorAll('.photo').forEach(p => p.classList.remove('show', 'hide'));
        if (photos[newIndex]) {
            const currentPhoto = document.getElementById(photos[currentIndex]);
            const newPhoto = document.getElementById(photos[newIndex]);
            
            if (currentPhoto && currentPhoto !== newPhoto) {
                currentPhoto.classList.add('hide');
            }
            if (newPhoto) {
                newPhoto.classList.add('show');
            }
        }
        
        currentIndex = newIndex;
    }
    
    // Initialize first photo (others are handled by active class)
    document.getElementById(photos[0]).classList.add('show');
});
"""

# I need to find where the old intersection observers were and replace them.
import re
pattern = re.compile(r'    // Photo Transition Logic.*?}\);', re.DOTALL)
new_content = pattern.sub(new_js, content)

with open(js_file, 'w') as f:
    f.write(new_content)
