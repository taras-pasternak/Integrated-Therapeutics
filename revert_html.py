import re

html_file = "/Users/pasternak/Documents/antigravity/Integrated/Integrated-Therapeutics/index.html"
with open(html_file, 'r') as f:
    content = f.read()

pattern = re.compile(r'<div class="left-content">.*?<div class="right-fixed">', re.DOTALL)

old_content = """<div class="left-content">
            <!-- Нова секція Approach -->
            <section class="approach-section" id="section-approach">
                <div class="approach-heading-wrapper">
                    <h2 class="approach-title">APPROACH</h2>
                </div>
                <div class="approach-text">
                    <p class="approach-lead">Biography</p>
                    <div class="approach-body">
                        <p><strong>Hi, I'm Tlielaxu</strong></p>
                        <p>A California Certified Massage Therapist (CMT #77839), holistic healer, and breathwork guide based in Encinitas, CA.</p>
                        <p>With extensive training in both Eastern and Western traditions—from deep tissue and biomechanical sports therapy to Thai massage, Esalen techniques, and Reiki—I blend science and intuition to craft highly personalized sessions.</p>
                        <p>My goal is to help you release physical tension, restore energetic balance, and achieve a profound state of wellness.</p>
                    </div>
                </div>
                
                <!-- Trigger for approach text fade out -->
                <div id="approach-out-trigger" style="grid-column: 1; grid-row: 1; align-self: end; height: 10vh; width: 1px; pointer-events: none;"></div>
            </section>

            <!-- Нова секція Services -->
            <section class="approach-section" id="section-services">
                <div class="approach-heading-wrapper">
                    <h2 class="approach-title">SERVICES</h2>
                </div>
                
                <div class="services-categories-container">
                    <!-- Категорія 1 -->
                    <div class="sticky-block-wrapper" id="category-01">
                        <div class="sticky-text-content services-text">
                            <h3 class="services-subtitle">Massage & Bodywork</h3>
                            <p class="services-quote">"Restore balance, release tension, and<br>reconnect with your body."</p>
                            
                            <div class="services-list">
                                <p><strong>Biomechanical Sports Therapy ($225 / 90 min):</strong> focuses on the body’s structure and musculature as they relate to sport-specific biomechanics.</p>
                                <p><strong>Deep Tissue ($225 / 90 min):</strong> targets chronic muscle knots using intense, focused pressure on deep tissue layers.</p>
                                <p><strong>Esalen Massage ($225 / 90 min):</strong> features long, slow, flowing strokes designed to create a deep state of mental and physical relaxation.</p>
                                <p><strong>Western Blend ($150 / 60 min; $225 / 90 min; $280 / 120 min):</strong> combines classic massage techniques, such as Manual Massage and Swedish, for a well-rounded relaxation experience.</p>
                            </div>
                        </div>
                        <div class="sticky-out-trigger"></div>
                    </div>

                    <!-- Категорія 2 -->
                    <div class="sticky-block-wrapper" id="category-02">
                        <div class="sticky-text-content services-text">
                            <h3 class="services-subtitle">Energy & Alternative Therapies</h3>
                            <p class="services-quote">"Align your internal energy systems and<br>optimize physical performance."</p>
                            
                            <div class="services-list">
                                <p><strong>Eastern Blend ($150 / 60 min; $225 / 90 min):</strong> integrates traditional Asian bodywork methods, including Ashiatsu, Thai, and Tui Na, to restore natural energy flow.</p>
                                <p><strong>Acutonics ($45 / 30 min):</strong> uses precision-calibrated tuning forks on acupuncture points to heal through sound vibrations.</p>
                                <p><strong>Tulayoga ($70 / 30 min):</strong> combines gentle yoga stretches with the unique, floating balance system for a profound physical release.</p>
                            </div>
                        </div>
                        <div class="sticky-out-trigger"></div>
                    </div>

                    <!-- Категорія 3 -->
                    <div class="sticky-block-wrapper" id="category-03">
                        <div class="sticky-text-content services-text">
                            <h3 class="services-subtitle">Specialized Treatments</h3>
                            <p class="services-quote">"Indulge in a sensory healing, skin renewal, and shared wellness experience."</p>
                            
                            <div class="services-list">
                                <p><strong>LaStone Therapy ($225 / 90 min):</strong> uses alternating hot basalt and cool marble stones to deeply soothe muscles and boost circulation.</p>
                                <p><strong>White Clay Scrub+Wrap ($255 / 90 min):</strong> gently exfoliates the skin before enveloping you in a mineral-rich, detoxifying white clay mask.</p>
                                <p><strong>Bamboo Scrub+Wrap ($255 / 90 min):</strong> uses natural bamboo particles to smooth the skin, followed by a hydrating, nourishing body wrap.</p>
                                <p><strong>Couples Instructional ($335 / 140 min):</strong> a hands-on, guided educational session where partners learn fundamental massage techniques taught by a professional.</p>
                            </div>
                        </div>
                        <div class="sticky-out-trigger"></div>
                    </div>
                </div>
            </section>

            <!-- Нова секція Reviews -->
            <section class="approach-section" id="section-reviews">
                <div class="approach-heading-wrapper">
                    <h2 class="approach-title">REVIEWS</h2>
                </div>
                
                <div class="services-categories-container">
                    <div class="sticky-block-wrapper">
                        <div class="sticky-text-content approach-text" style="max-width: 600px;">
                            <h3 class="services-subtitle">Client’s Voice</h3>
                            
                            <div style="margin-top: 3rem;">
                                <div style="margin-bottom: 3rem;">
                                    <p class="services-quote" style="margin-bottom: 0.5rem;">"He tailors every session to what my body needs. It helps me release muscles that are overworked and build better body alignment."</p>
                                    <p style="font-size: 0.95rem; font-weight: 400; color: #555;"><strong>Michael S.</strong> &middot; July 23, 2025</p>
                                </div>
                                
                                <div style="margin-bottom: 3rem;">
                                    <p class="services-quote" style="margin-bottom: 0.5rem;">"Every session still feels creative, deeply healing, and completely attuned to what I need. Tlielaxu has become indispensable to my sense of wellbeing."</p>
                                    <p style="font-size: 0.95rem; font-weight: 400; color: #555;"><strong>Geoff A.</strong> &middot; June 17, 2025</p>
                                </div>
                                
                                <div style="margin-bottom: 3rem;">
                                    <p class="services-quote" style="margin-bottom: 0.5rem;">"His impeccable technique, breadth of training, deep body knowledge, and intuitive strength set him apart as a true master."</p>
                                    <p style="font-size: 0.95rem; font-weight: 400; color: #555;"><strong>Mark S.</strong> &middot; June 17, 2025</p>
                                </div>
                            </div>
                        </div>
                        <div class="sticky-out-trigger"></div>
                    </div>
                </div>
            </section>
        </div>

        <div class="right-fixed">"""

content = pattern.sub(old_content, content)
content = content.replace('js/main.js?v=5', 'js/main.js?v=6')
content = content.replace('css/style.css?v=7', 'css/style.css?v=8')

with open(html_file, 'w') as f:
    f.write(content)
