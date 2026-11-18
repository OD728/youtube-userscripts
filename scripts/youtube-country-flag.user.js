// ==UserScript==
// @name         YouTube Enhancer (Reveal Country Flag Only)
// @namespace    http://tampermonkey.net/
// @description  Reveals the Country Flag next to channel names and video titles.
// @version      1.2
// @match        *://*.youtube.com/*
// @connect      channel-info.pages.dev
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// ==/UserScript==

(function () {
    'use strict';

    const FLAG_CONFIG = {
        BASE_URL: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/flags/4x3/',
        SIZES: { channel: '28px', video: '22px' },
        MARGINS: { channel: '12px', video: '10px' }
    };

    const CACHE_CONFIG = {
        PREFIX: 'yt_flag_',
        EXPIRATION: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    const processedElements = new Set();

    function getFromCache(type, id) {
        const key = `${CACHE_CONFIG.PREFIX}${type}_${id}`;
        try {
            const cachedData = GM_getValue(key);
            if (!cachedData) return null;
            const { value, timestamp } = JSON.parse(cachedData);
            if (Date.now() - timestamp > CACHE_CONFIG.EXPIRATION) {
                GM_deleteValue(key); // remove stale entries so storage doesn't grow forever
                return null;
            }
            return value;
        } catch { return null; }
    }

    function setToCache(type, id, value) {
        GM_setValue(`${CACHE_CONFIG.PREFIX}${type}_${id}`, JSON.stringify({ value, timestamp: Date.now() }));
    }

    async function getCountryData(type, id) {
        const cached = getFromCache(type, id);
        if (cached) return cached;

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://channel-info.pages.dev/api/flag/${type}/${id}`,
                onload: (response) => {
                    if (response.status === 200) {
                        try {
                            const result = JSON.parse(response.responseText);
                            const data = result.data || result;
                            const countryData = {
                                code: (data.country || '').toLowerCase(),
                                name: data.countryName || ''
                            };
                            setToCache(type, id, countryData);
                            resolve(countryData);
                        } catch { resolve(null); }
                    } else resolve(null);
                },
                onerror: () => resolve(null)
            });
        });
    }

    function createFlag(size, margin, countryData) {
        const flag = document.createElement('img');
        flag.src = `${FLAG_CONFIG.BASE_URL}${countryData.code}.svg`;
        flag.className = 'yt-country-flag';
        flag.style.cssText = `width: ${size}; height: auto; margin-left: ${margin}; vertical-align: middle; cursor: pointer;`;
        flag.title = countryData.name || '';
        flag.onerror = () => flag.remove(); // unknown country code -> no broken image icon
        return flag;
    }

    async function addFlags() {
        // YouTube reuses title elements between videos. If you navigate while a
        // lookup is in flight, the old result must not be added to the new page.
        const startUrl = window.location.href;
        const stillSamePage = () => window.location.href === startUrl;

        // 1. Channel Pages
        const channelElement = document.querySelector('h1.dynamicTextViewModelH1 > span.yt-core-attributed-string')
            || document.querySelector('#channel-name #text')
            || document.querySelector('yt-formatted-string.style-scope.ytd-channel-name');

        if (channelElement && !processedElements.has(channelElement)) {
            processedElements.add(channelElement);
            const channelMatch = window.location.pathname.match(/(@[\w.-]+|\/channel\/[\w.-]+)/);
            if (channelMatch) {
                const channelId = channelMatch[0].replace('/channel/', '').replace('/', '');
                const countryData = await getCountryData('channel', channelId);
                if (countryData && countryData.code && stillSamePage()) {
                    channelElement.appendChild(createFlag(FLAG_CONFIG.SIZES.channel, FLAG_CONFIG.MARGINS.channel, countryData));
                }
            }
        }

        // 2. Video Titles
        const videoElement = document.querySelector('ytd-watch-metadata #title yt-formatted-string')
            || document.querySelector('#title yt-formatted-string');

        if (videoElement && !processedElements.has(videoElement)) {
            const videoParent = videoElement.closest('#title h1');
            if (videoParent) {
                processedElements.add(videoElement);
                const videoId = new URLSearchParams(window.location.search).get('v');
                if (videoId) {
                    const countryData = await getCountryData('video', videoId);
                    if (countryData && countryData.code && stillSamePage()) {
                        videoParent.style.display = 'flex';
                        videoParent.style.alignItems = 'center';
                        videoParent.appendChild(createFlag(FLAG_CONFIG.SIZES.video, FLAG_CONFIG.MARGINS.video, countryData));
                    }
                }
            }
        }

        // Shorts are intentionally not handled (you don't use them, and
        // preloaded Shorts would get the wrong flag).
    }

    let timeout;
    const observer = new MutationObserver(() => {
        clearTimeout(timeout);
        timeout = setTimeout(addFlags, 500);
    });

    function init() {
        processedElements.clear();
        document.querySelectorAll('.yt-country-flag').forEach(el => el.remove());
        addFlags();
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('yt-navigate-finish', init);
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
