// ==UserScript==
// @name         YouTube Default 1440p
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically sets YouTube video quality to 1440p or the closest available high resolution.
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // YouTube's internal quality names, in order of preference.
    // hd2880 = 2880p (5K), highres = 4320p (8K), large = 480p, medium = 360p, small = 240p
    const QUALITY_ORDER = ['hd1440', 'hd2160', 'hd2880', 'highres', 'hd1080', 'hd720', 'large', 'medium', 'small'];

    const RETRY_DELAY_MS = 500;
    const MAX_RETRIES = 20; // give up after ~10s instead of retrying forever

    let lastVideoId = '';

    function setVideoQuality(attempt = 0) {
        // Only on watch pages
        if (!new URLSearchParams(window.location.search).get('v')) return;

        // #movie_player is the main player (not a home-page hover preview)
        const player = document.getElementById('movie_player');
        const available = player && typeof player.getAvailableQualityLevels === 'function'
            ? player.getAvailableQualityLevels()
            : [];

        if (!available || available.length === 0) {
            if (attempt < MAX_RETRIES) {
                setTimeout(() => setVideoQuality(attempt + 1), RETRY_DELAY_MS);
            }
            return;
        }

        const chosen = QUALITY_ORDER.find(q => available.includes(q));
        if (!chosen || player.getPlaybackQuality() === chosen) return;

        // setPlaybackQualityRange is what actually sticks on current YouTube;
        // setPlaybackQuality is kept as a fallback for older player versions.
        try { player.setPlaybackQualityRange(chosen, chosen); } catch (e) { /* unavailable */ }
        try { player.setPlaybackQuality(chosen); } catch (e) { /* unavailable */ }
    }

    // Runs on first load and on every YouTube in-app navigation
    function onNavigate() {
        const videoId = new URLSearchParams(window.location.search).get('v');
        if (videoId && videoId !== lastVideoId) {
            lastVideoId = videoId;
            setTimeout(() => setVideoQuality(), 1000); // wait for the player to spin up
        }
    }

    window.addEventListener('yt-navigate-finish', onNavigate);
    window.addEventListener('load', onNavigate);
})();
