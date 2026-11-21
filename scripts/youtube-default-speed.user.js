// ==UserScript==
// @name         YouTube Default Speed 1.30x
// @namespace    https://github.com/OD728
// @version      1.3.2
// @description  Sets YouTube playback speed to 1.30x on each new video (excludes Music and Live). Manual speed changes are respected.
// @author       OD728
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        *://*.youtube.com/*
// @exclude      *://music.youtube.com/*
// @grant        none
// @homepageURL  https://github.com/OD728/youtube-userscripts
// @supportURL   https://github.com/OD728/youtube-userscripts/issues
// @downloadURL  https://raw.githubusercontent.com/OD728/youtube-userscripts/main/scripts/youtube-default-speed.user.js
// @updateURL    https://raw.githubusercontent.com/OD728/youtube-userscripts/main/scripts/youtube-default-speed.user.js
// ==/UserScript==

(function() {
    'use strict';

    const SPEED = 1.30;
    // YouTube resets the speed when a video or ad starts, so the speed is
    // enforced for the first few seconds of playback, then left alone so
    // you can still change it yourself.
    const ENFORCE_MS = 3000;

    let currentKey = null;
    let playingSince = null;

    setInterval(() => {
        // Pick the player for the current page. YouTube keeps the hidden watch
        // player around on Shorts, so we can't just take whichever comes first.
        // (Hover previews on the home page are left alone.)
        const onShorts = window.location.pathname.startsWith('/shorts');
        const player = document.querySelector(onShorts ? '#shorts-player' : '#movie_player');
        const video = player && player.querySelector('video');
        if (!video) return;

        const isLive = player.querySelector('.ytp-live-badge[aria-disabled="true"], .ytp-live') != null
            || window.location.pathname.includes('/live/');
        const isAd = player.classList.contains('ad-showing');

        // A new video (or switching between ad and video) restarts the enforce window
        const key = window.location.href + (isAd ? '|ad' : '');
        if (key !== currentKey) {
            currentKey = key;
            playingSince = null;
        }

        if (isLive || video.paused) return;
        if (playingSince === null) playingSince = Date.now();

        if (Date.now() - playingSince < ENFORCE_MS && video.playbackRate !== SPEED) {
            video.playbackRate = SPEED;
        }
    }, 250);
})();
