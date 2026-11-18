// ==UserScript==
// @name         Hide YouTube Members Only Videos
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Cleans up your YouTube grid layouts by completely hiding member-exclusive content
// @author       Superflyin
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/582181/Hide%20YouTube%20Members%20Only%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/582181/Hide%20YouTube%20Members%20Only%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Using textContent instead of innerHTML cleanly bypasses the Trusted Types security violation
    const style = document.createElement('style');
    style.textContent = `
        ytd-rich-item-renderer.hide-grid-cell,
        ytd-grid-video-renderer.hide-grid-cell,
        ytd-video-renderer.hide-grid-cell,
        ytd-rich-grid-media.hide-grid-cell {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    const targetTags = ['YTD-RICH-ITEM-RENDERER', 'YTD-GRID-VIDEO-RENDERER', 'YTD-VIDEO-RENDERER', 'YTD-RICH-GRID-MEDIA'];

    const cleanUp = () => {
        const selectors = [
            '[class*="BadgeShapeText"]',
            '[class*="ViewModelTitle"]',
            '.ytBadgeShapeText',
            '.yt-badge-shape__text',
            'badge-shape div',
            '#video-title',
            '#video-title-link'
        ];

        const elements = document.querySelectorAll(selectors.join(','));
        let foundNew = false;

        elements.forEach(el => {
            const text = el.textContent.trim().toLowerCase();
            if (text.includes('members only') || text.includes('members first') || text.includes('[members]')) {

                let card = el.parentElement;
                while (card && !targetTags.includes(card.tagName)) {
                    card = card.parentElement;
                }

                if (card && !card.classList.contains('hide-grid-cell')) {
                    card.classList.add('hide-grid-cell');
                    foundNew = true;
                }
            }
        });

        if (foundNew) {
            window.dispatchEvent(new Event('resize'));
        }
    };

    const observer = new MutationObserver(() => {
        cleanUp();
    });

    const startScript = () => {
        cleanUp();

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Cold boot protection loop
        let checks = 0;
        const bootInterval = setInterval(() => {
            cleanUp();
            checks++;
            if (checks > 10) clearInterval(bootInterval);
        }, 300);
    };

    if (document.body) {
        startScript();
    } else {
        document.addEventListener('DOMContentLoaded', startScript);
    }
})();
