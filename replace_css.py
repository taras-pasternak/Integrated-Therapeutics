css_file = "/Users/pasternak/Documents/antigravity/Integrated/Integrated-Therapeutics/css/style.css"

with open(css_file, 'r') as f:
    lines = f.readlines()

new_css = """/* --- Master Scrollytelling --- */
.master-sticky-container {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding-top: 2rem;
    overflow: hidden;
}

.dynamic-heading-wrapper {
    position: relative;
    height: fit-content;
    z-index: 20;
    min-height: 10rem;
    margin-bottom: 2rem;
}

.heading-layer {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 0.8s ease;
}

.heading-layer.active {
    opacity: 1;
}

.dynamic-text-container {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.scrolly-text-block {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    pointer-events: none;
}

.scrolly-text-block.active {
    pointer-events: auto;
}

/* Animations for text inside scrolly block */
.scrolly-text-block > * {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 1.2s ease, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.scrolly-text-block.active > * {
    opacity: 1;
    transform: translateY(0);
}

.scrolly-text-block.out-up > * {
    opacity: 0;
    transform: translateY(-40px);
    transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.scrolly-text-block.out-down > * {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Stagger Delays */
.scrolly-text-block > *:nth-child(1) { transition-delay: 0.1s; }
.scrolly-text-block > *:nth-child(2) { transition-delay: 0.3s; }
.scrolly-text-block > *:nth-child(3) { transition-delay: 0.5s; }
.scrolly-text-block > *:nth-child(4) { transition-delay: 0.7s; }

/* Out Stagger Overrides */
.scrolly-text-block.out-up > *:nth-child(1), .scrolly-text-block.out-down > *:nth-child(1) { transition-delay: 0s !important; }
.scrolly-text-block.out-up > *:nth-child(2), .scrolly-text-block.out-down > *:nth-child(2) { transition-delay: 0.1s !important; }
.scrolly-text-block.out-up > *:nth-child(3), .scrolly-text-block.out-down > *:nth-child(3) { transition-delay: 0.2s !important; }
.scrolly-text-block.out-up > *:nth-child(4), .scrolly-text-block.out-down > *:nth-child(4) { transition-delay: 0.3s !important; }
"""

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "/* --- Generic Sticky Scrollytelling Logic --- */" in line:
        start_idx = i
    if "/* --- Contact Section --- */" in line:
        end_idx = i

if start_idx != -1 and end_idx != -1:
    lines = lines[:start_idx] + [new_css + "\n"] + lines[end_idx:]
    with open(css_file, 'w') as f:
        f.writelines(lines)
else:
    print("Could not find CSS markers")
