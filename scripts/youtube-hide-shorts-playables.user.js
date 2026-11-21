// ==UserScript==
// @name         YouTube Hide Shorts & Playables
// @namespace    https://github.com/OD728
// @version      1.3.0
// @description  Hides Shorts, YouTube Playables and YouTube promos and ad panels (featured shelves, Premium banners, popups, sponsored items, merch). Shorts links open as normal videos.
// @author       OD728
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @homepageURL  https://github.com/OD728/youtube-userscripts
// @supportURL   https://github.com/OD728/youtube-userscripts/issues
// @downloadURL  https://raw.githubusercontent.com/OD728/youtube-userscripts/main/scripts/youtube-hide-shorts-playables.user.js
// @updateURL    https://raw.githubusercontent.com/OD728/youtube-userscripts/main/scripts/youtube-hide-shorts-playables.user.js
// ==/UserScript==

(function () {
    'use strict';

    // 1. Shorts links: open them as a normal video instead of the Shorts player.
    const redirectShorts = () => {
        const match = window.location.pathname.match(/^\/shorts\/([\w-]+)/);
        if (match) {
            window.location.replace(`/watch?v=${match[1]}${window.location.search.replace('?', '&')}`);
        }
    };
    redirectShorts();
    window.addEventListener('yt-navigate-start', redirectShorts);
    window.addEventListener('yt-navigate-finish', redirectShorts);

    // 2. Hide Shorts and Playables with CSS only. The browser applies it to
    //    new content automatically, so there's no scanning loop.
    const css = `
        /* Shorts shelves (home, subscriptions, search, video sidebar) */
        ytd-rich-shelf-renderer[is-shorts],
        ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]),
        ytd-reel-shelf-renderer,
        grid-shelf-view-model:has(a[href^="/shorts/"]),
        ytd-rich-section-renderer:has(grid-shelf-view-model a[href^="/shorts/"]),

        /* Single Shorts mixed into grids, lists and search results */
        ytd-rich-item-renderer:has(a[href^="/shorts/"]),
        ytd-video-renderer:has(a[href^="/shorts/"]),
        ytd-grid-video-renderer:has(a[href^="/shorts/"]),
        ytd-compact-video-renderer:has(a[href^="/shorts/"]),
        yt-lockup-view-model:has(a[href^="/shorts/"]),
        ytm-shorts-lockup-view-model,
        ytm-shorts-lockup-view-model-v2,

        /* "Shorts" in the left menu (full and collapsed) */
        ytd-guide-entry-renderer:has(a[title="Shorts"]),
        ytd-mini-guide-entry-renderer:has(a[href^="/shorts"]),

        /* "Shorts" tab on channel pages */
        yt-tab-shape[tab-title="Shorts"],

        /* YouTube Playables (games shelf on the home page, menu entry) */
        ytd-rich-section-renderer:has(a[href*="/playables"]),
        ytd-rich-section-renderer:has(ytd-mini-game-card-view-model),
        ytd-rich-shelf-renderer:has(a[href*="/playables"]),
        ytd-guide-entry-renderer:has(a[href*="/playables"]),
        ytd-mini-guide-entry-renderer:has(a[href*="/playables"]),

        /* "YouTube featured" promo shelves (e.g. "Your home for Grand Theft Auto VI").
           YouTube marks them with a featured-promo attribute in every language. */
        ytd-shelf-renderer[featured-promo],
        ytd-rich-shelf-renderer[featured-promo],
        ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[featured-promo]),

        /* Other YouTube promos: Premium/feature banners, "Try Premium" popups,
           movie and brand promos, sponsored (promoted) videos */
        ytd-banner-promo-renderer,
        ytd-statement-banner-renderer,
        ytd-primetime-promo-renderer,
        ytd-mealbar-promo-renderer,
        yt-mealbar-promo-renderer,
        tp-yt-paper-dialog:has(yt-mealbar-promo-renderer),
        tp-yt-paper-dialog:has(ytd-mealbar-promo-renderer),
        ytd-movie-offer-module-renderer,
        ytd-brand-video-shelf-renderer,
        ytd-brand-video-singleton-renderer,
        ytd-promoted-video-renderer,
        ytd-compact-promoted-item-renderer,
        ytd-promoted-sparkles-web-renderer,
        ytd-promoted-sparkles-text-search-renderer,
        ytd-rich-section-renderer:has(ytd-banner-promo-renderer),
        ytd-rich-section-renderer:has(ytd-statement-banner-renderer),
        ytd-rich-section-renderer:has(ytd-brand-video-shelf-renderer),
        ytd-rich-item-renderer:has(ytd-promoted-sparkles-web-renderer),

        /* Merch and ticket shelves under videos */
        ytd-merch-shelf-renderer,
        ytd-ticket-shelf-renderer {
            display: none !important;
        }

        /* Ad panels and ad banners next to the video (moved here from your
           YouTube CSS). A separate rule, so a selector YouTube breaks here
           can't cancel all the rules above. */
        [target-id="engagement-panel-ads"],
        ytd-ads-engagement-panel-content-renderer,
        .ytwPanelAdHeaderImageLockupViewModelHost,
        .ytwTopBannerImageTextIconButtonedLayoutViewModelHostMetadataMenu {
            display: none !important;
        }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
})();
