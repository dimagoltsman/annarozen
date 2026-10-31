// Anna Rozen Golzman — site behaviour
// Galleries and the price toggle are pure CSS. This file only handles
// the sticky booking bar and the #policy deep link.
(function () {
    'use strict';

    // Hide the sticky bar while the hero's own buttons are on screen,
    // so the same two actions never show twice.
    function initBookBar() {
        var bar = document.getElementById('book-bar');
        var heroActions = document.getElementById('hero-actions');
        if (!bar || !heroActions || !('IntersectionObserver' in window)) return;

        var observer = new IntersectionObserver(function (entries) {
            bar.classList.toggle('is-hidden', entries[0].isIntersecting);
        }, { threshold: 0.4 });

        observer.observe(heroActions);
    }

    // Open the appointment policy when linked directly (index.html#policy).
    function initPolicyDeepLink() {
        var section = document.getElementById('policy');
        var details = section && section.querySelector('details');
        if (!details) return;

        function openFromHash() {
            if (window.location.hash !== '#policy') return;
            details.open = true;
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        window.addEventListener('hashchange', openFromHash);
        openFromHash();
    }

    document.addEventListener('DOMContentLoaded', function () {
        initBookBar();
        initPolicyDeepLink();
    });
})();
