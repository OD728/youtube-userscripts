// ==UserScript==
// @name         YouTube Simple Auto-Pause
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Prevents YouTube videos from autoplaying when opened.
// @match        *://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let hasPaused = false;

    // Reset our tracker every time you click a new video (YouTube's internal navigation)
    window.addEventListener('yt-navigate-start', () => {
        hasPaused = false;
    });

    // Check continuously for the video element to load
    setInterval(() => {
        const video = document.querySelector('video');

        // If the video exists, is playing, and we haven't paused it yet...
        if (video && !video.paused && !hasPaused) {
            video.pause();   // Pause the video
            hasPaused = true; // Mark as paused so we don't stop you from clicking play later
        }
    }, 100);
})();
