// ==UserScript==
// @name         YouTube Default 1440p
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically sets YouTube video quality to 1440p or the closest available high resolution.
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_QUALITY = '1440p';

    // Fallback hierarchy if 1440p isn't available (tries higher first, then lower)
    const QUALITY_FALLBACKS = ['2160p', '2880p', 'highres', '1440p', '1080p', '720p', '480p'];

    let lastVideoId = '';

    function setVideoQuality() {
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get('v');

        // Ensure we are on a watch page and it's a new video
        if (!videoId) return;

        const player = document.querySelector('.html5-video-player');
        if (!player || typeof player.getAvailableQualityLevels !== 'function') {
            setTimeout(setVideoQuality, 500);
            return;
        }

        const availableQualities = player.getAvailableQualityLevels();
        if (!availableQualities || availableQualities.length === 0) {
            setTimeout(setVideoQuality, 500);
            return;
        }

        // Map YouTube's internal quality strings to readable labels
        // e.g., 'hd1440' -> '1440p', 'hd1080' -> '1080p'
        const qualityMap = {
            'highres': '2160p+', // 4K/8K
            'hd2880': '2880p',
            'hd2160': '2160p',
            'hd1440': '1440p',
            'hd1080': '1080p',
            'hd720': '720p',
            'large': '480p',
            'medium': '360p',
            'small': '240p'
        };

        // Find the best match based on our fallback list
        let chosenQuality = null;

        // Try exact match for 1440p first ('hd1440')
        for (const [internalKey, label] of Object.entries(qualityMap)) {
            if (label === TARGET_QUALITY && availableQualities.includes(internalKey)) {
                chosenQuality = internalKey;
                break;
            }
        }

        // If 1440p isn't found, look for fallback options in order of preference
        if (!chosenQuality) {
            for (const targetFallback of QUALITY_FALLBACKS) {
                for (const [internalKey, label] of Object.entries(qualityMap)) {
                    if (label === targetFallback && availableQualities.includes(internalKey)) {
                        chosenQuality = internalKey;
                        break;
                    }
                }
                if (chosenQuality) break;
            }
        }

        if (chosenQuality && player.getPlaybackQuality() !== chosenQuality) {
            player.setPlaybackQuality(chosenQuality);
            // Forcefully trigger a quality update via local storage API hook if player resists
            try {
                player.setPlaybackQualityRange(chosenQuality, chosenQuality);
            } catch (e) {
                // Ignore if method is unavailable
            }
        }
    }

    // Monitor URL/page changes for single-page application navigation
    const observer = new MutationObserver(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get('v');
        if (videoId && videoId !== lastVideoId) {
            lastVideoId = videoId;
            setTimeout(setVideoQuality, 1000); // Wait for player to spin up
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial load execution
    window.addEventListener('load', () => {
        setTimeout(setVideoQuality, 1500);
    });
})();
