// ==UserScript==
// @name         YouTube Default Speed 1.30x
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Sets YouTube playback speed to 1.30x (excludes Music and Live)
// @match        *://*.youtube.com/*
// @exclude      *://music.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        const video = document.querySelector('video');
        const isLive = document.querySelector('.ytp-live-badge[aria-disabled="true"], .ytp-live') != null || window.location.pathname.includes('/live/');

        if (video && !isLive && video.playbackRate !== 1.30) {
            video.playbackRate = 1.30;
        }
    }, 1000);
})();
