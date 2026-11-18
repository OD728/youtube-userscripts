// ==UserScript==
// @name         Hide YouTube Members Only Videos
// @namespace    https://github.com/OD728
// @version      1.1.1
// @description  Cleans up your YouTube grid layouts by completely hiding member-exclusive content
// @author       OD728 (based on work by Superflyin)
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        https://www.youtube.com/*
// @grant        none
// @homepageURL  https://github.com/OD728/youtube-userscripts
// @supportURL   https://github.com/OD728/youtube-userscripts/issues
// @downloadURL  https://raw.githubusercontent.com/OD728/youtube-userscripts/main/scripts/youtube-hide-members-only.user.js
// @updateURL    https://raw.githubusercontent.com/OD728/youtube-userscripts/main/scripts/youtube-hide-members-only.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Using textContent instead of innerHTML avoids YouTube's Trusted Types security error
    const style = document.createElement('style');
    style.textContent = `
        ytd-rich-item-renderer.hide-grid-cell,
        ytd-grid-video-renderer.hide-grid-cell,
        ytd-video-renderer.hide-grid-cell,
        ytd-rich-grid-media.hide-grid-cell {
            display: none !important;
        }
    `;
    (document.head || document.documentElement).appendChild(style);

    const targetTags = ['YTD-RICH-ITEM-RENDERER', 'YTD-GRID-VIDEO-RENDERER', 'YTD-VIDEO-RENDERER', 'YTD-RICH-GRID-MEDIA'];

    const selectors = [
        '[class*="BadgeShapeText"]',
        '[class*="ViewModelTitle"]',
        '.ytBadgeShapeText',
        '.yt-badge-shape__text',
        'badge-shape div',
        '#video-title',
        '#video-title-link'
    ].join(',');

    const cleanUp = () => {
        let foundNew = false;

        document.querySelectorAll(selectors).forEach(el => {
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

        // Nudge YouTube to re-flow the grid so there are no gaps
        if (foundNew) {
            window.dispatchEvent(new Event('resize'));
        }
    };

    // YouTube changes the page constantly. Batch all changes within one
    // animation frame into a single scan instead of scanning on every change.
    let scheduled = false;
    const scheduleCleanUp = () => {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => {
            scheduled = false;
            cleanUp();
        });
    };

    const observer = new MutationObserver(scheduleCleanUp);

    const startScript = () => {
        cleanUp();
        observer.observe(document.body, { childList: true, subtree: true });
    };

    if (document.body) {
        startScript();
    } else {
        document.addEventListener('DOMContentLoaded', startScript);
    }
})();
