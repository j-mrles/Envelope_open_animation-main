document.addEventListener("DOMContentLoaded", function(){
    const languageSelector = document.getElementById("languageSelector");
    const mainContent = document.getElementById("mainContent");
    const envelope = document.getElementById("evnelope");
    const whiteOverlay = document.getElementById("whiteOverlay");
    const fullInvitation = document.getElementById("fullInvitation");
    const clickPrompt = document.getElementById("clickPrompt");
    let currentLang = 'en';
    let openClickCount = 0;

    // Language selection
    function selectLanguage(lang) {
        currentLang = lang;
        updateLanguage(lang);
        // Hide language selector and show main content
        languageSelector.style.opacity = '0';
        setTimeout(function() {
            languageSelector.style.display = 'none';
            mainContent.style.display = 'block';
            setTimeout(function() {
                mainContent.style.opacity = '1';
            }, 50);
        }, 300);
    }

    function updateLanguage(lang) {
        const elements = document.querySelectorAll('[data-en][data-es]');
        elements.forEach(function(element) {
            element.textContent = element.getAttribute('data-' + lang);
        });
    }

    // Language button handlers
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            selectLanguage(lang);
        });
        btn.addEventListener('touchend', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            selectLanguage(lang);
        });
    });

    function openEnvelope(){
        // Hide prompt on first click
        if (openClickCount === 0) {
            clickPrompt.style.opacity = '0';
            setTimeout(function() {
                clickPrompt.style.display = 'none';
            }, 300);
        }
        
        openClickCount++;
        
        if (openClickCount === 1) {
            // First click: open the envelope normally
            envelope.classList.add("open");
            envelope.classList.remove("close");
        } else if (openClickCount >= 2) {
            // Subsequent clicks: slide letter all the way out
            envelope.classList.add("letter-out");
            // After letter slides out, fade the envelope and show white overlay
            setTimeout(function() {
                envelope.classList.add("fade-out");
                whiteOverlay.classList.add("fade-in");
                // After white overlay fades in, show the full invitation
                setTimeout(function() {
                    fullInvitation.classList.add("show");
                }, 1000); // Wait for white overlay to fade in (1s)
            }, 1200); // Wait for letter animation to complete (1.2s - slower)
        }
    }

    // Envelope event listeners (elements exist but are hidden until language is selected)
    envelope.addEventListener("click", openEnvelope);
    envelope.addEventListener("touchend", function(e) {
        e.preventDefault();
        openEnvelope();
    });
    // Also allow clicking the wrapper
    const wrapper = document.querySelector('.evnelope-wrapper');
    if (wrapper) {
        wrapper.addEventListener("click", openEnvelope);
        wrapper.addEventListener("touchend", function(e) {
            e.preventDefault();
            openEnvelope();
        });
    }
});