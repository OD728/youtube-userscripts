// ==UserScript==
// @name         YouTube Simple Auto-Pause
// @namespace    https://github.com/OD728
// @version      1.1.1
// @description  Prevents YouTube videos from autoplaying when opened.
// @author       OD728
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        *://*.youtube.com/*
// @grant        none
// @homepageURL  https://github.com/OD728/youtube-userscripts
// @supportURL   https://github.com/OD728/youtube-userscripts/issues
// @downloadURL  https://raw.githubusercontent.com/OD728/youtube-userscripts/main/scripts/youtube-auto-pause.user.js
// @updateURL    https://raw.githubusercontent.com/OD728/youtube-userscripts/main/scripts/youtube-auto-pause.user.js
// ==/UserScript==

(function() {
    'use strict';

    // "Armed" = keep pausing until you interact with the page.
    // Re-armed every time you open a new video (YouTube's internal navigation).
    let armed = true;

    window.addEventListener('yt-navigate-start', () => {
        armed = true;
    });

    // Any real click or key press means you're in control: stop pausing.
    // (Clicking a thumbnail disarms, but the navigation that follows re-arms.)
    const disarm = (e) => {
        if (e.isTrusted) armed = false;
    };
    window.addEventListener('pointerdown', disarm, true);
    window.addEventListener('keydown', disarm, true);

    setInterval(() => {
        // Only on normal watch pages; Shorts and home-page hover previews are left alone
        if (!armed || window.location.pathname !== '/watch') return;

        const video = document.querySelector('#movie_player video');
        if (video && !video.paused) {
            video.pause();
        }
    }, 100);
})();
