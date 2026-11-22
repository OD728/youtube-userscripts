// ==UserScript==
// @name         YouTube Clean Interface
// @namespace    https://github.com/OD728
// @version      1.2.1
// @description  Hides clutter: sidebar extras (Explore, More from YouTube, Report history, footer), header buttons, video action buttons, AI/transcript extras, and Mixes, music videos and movies in feeds and recommendations.
// @author       OD728
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @homepageURL  https://github.com/OD728/youtube-userscripts
// @supportURL   https://github.com/OD728/youtube-userscripts/issues
// @downloadURL  https://raw.githubusercontent.com/OD728/youtube-userscripts/main/scripts/youtube-clean-sidebar.user.js
// @updateURL    https://raw.githubusercontent.com/OD728/youtube-userscripts/main/scripts/youtube-clean-sidebar.user.js
// ==/UserScript==

(function () {
    'use strict';

    // Each section is its own rule: if YouTube changes something and one
    // selector becomes invalid, only that section stops working.
    const css = `
        /* ---------- Left sidebar ----------
           Sections are recognized by the links inside them, not by their
           titles, so this works in any language. */

        /* "Explore": Music, Movies & TV, Live, Gaming, Podcasts, Memberships */
        ytd-guide-section-renderer:has(a[href^="/feed/storefront"]),
        ytd-guide-section-renderer:has(a[href^="/gaming"]),
        ytd-guide-section-renderer:has(a[href^="/podcasts"]),

        /* "More from YouTube": Premium, Music, Kids, Labs */
        ytd-guide-section-renderer:has(a[href*="youtubekids.com"]),
        ytd-guide-section-renderer:has(a[href="/premium"]),

        /* "Report history" entry, plus its section unless Settings is in it too.
           (CSS doesn't allow :has() inside :has().) */
        ytd-guide-entry-renderer:has(a[href^="/reporthistory"]),
        ytd-guide-entry-renderer:has(a[title="Report history"]),
        ytd-guide-section-renderer:has(a[href^="/reporthistory"]):not(:has(a[href^="/account"])),

        /* Footer: About, Press, Copyright ... Terms, Privacy ... (c) Google LLC */
        ytd-guide-renderer #footer {
            display: none !important;
        }

        /* ---------- Header ----------
           Voice search, Create, Notifications, country code, search button */
        #voice-search-button.ytd-masthead,
        button[aria-label="Search with your voice"],
        button[aria-label="Create"],
        button[aria-label="Notifications"],
        #country-code,
        .ytSearchboxComponentSearchButton,
        .ytSearchboxComponentSearchButtonDark {
            display: none !important;
        }

        /* ---------- Buttons under the video ----------
           Join, Share, Thanks, Clip, Download, Save, and the extra button row */
        button[aria-label="Join this channel"],
        ytd-watch-flexy ytd-menu-renderer button[aria-label="Share"],
        ytd-watch-flexy ytd-menu-renderer button[aria-label="Thanks"],
        ytd-watch-flexy ytd-menu-renderer button[aria-label="Clip"],
        ytd-watch-flexy ytd-menu-renderer button[aria-label="Download"],
        ytd-watch-flexy ytd-menu-renderer button[aria-label="Save"],
        ytd-watch-flexy #flexible-item-buttons {
            display: none !important;
        }

        /* ---------- Extras on the watch page ----------
           AI video summary, "Ask" (AI chat) section, transcript section,
           reply-thread lines in comments, stacked-playlist decoration */
        #video-summary,
        .ytVideoDescriptionYouchatSectionViewModelHost,
        .ytd-video-description-transcript-section-renderer,
        .ytSubThreadConnection,
        .ytCollectionsStackCollectionStack2,
        .ytCollectionsStackCollectionStack1 {
            display: none !important;
        }

        /* YouTube movies ("Free of charge" / price badge, age rating like
           FSK 12). Their own element, the "Commerce" badge style, or a link
           to the official "YouTube Movies & TV" channel. */
        ytd-browse ytd-movie-renderer,
        ytd-browse ytd-grid-movie-renderer,
        ytd-watch-flexy ytd-compact-movie-renderer,
        ytd-rich-item-renderer:has(ytd-movie-renderer),
        ytd-rich-item-renderer:has(badge-shape.ytBadgeShapeCommerce),
        ytd-rich-item-renderer:has(a[href="/channel/UCuVPpxrm2VAgpH3Ktln4HXg"]),
        ytd-browse yt-lockup-view-model:has(badge-shape.ytBadgeShapeCommerce),
        ytd-watch-flexy #secondary yt-lockup-view-model:has(badge-shape.ytBadgeShapeCommerce),
        ytd-watch-flexy #secondary yt-lockup-view-model:has(a[href="/channel/UCuVPpxrm2VAgpH3Ktln4HXg"]) {
            display: none !important;
        }
    `;

    // Mixes, music videos and YouTube movies in the home feed, channel
    // pages and the watch-page sidebar. Search results are left alone, so
    // something you search for on purpose still shows up.
    // YouTube links both "Mix - ..." playlists and music videos (the ones
    // with the music-note duration badge) as a radio:
    // /watch?v=ID&list=RD...&start_radio=1. That works in every language.
    const feedCss = `
        /* Mix playlists, older layout */
        ytd-browse ytd-radio-renderer,
        ytd-browse ytd-grid-radio-renderer,
        ytd-watch-flexy ytd-compact-radio-renderer,

        /* Mixes and music videos, by their radio link */
        ytd-rich-item-renderer:has(a[href*="start_radio=1"]),
        ytd-rich-item-renderer:has(a[href*="list=RD"]),
        ytd-browse ytd-grid-video-renderer:has(a[href*="start_radio=1"]),
        ytd-watch-flexy ytd-compact-video-renderer:has(a[href*="start_radio=1"]),
        ytd-browse yt-lockup-view-model:has(a[href*="start_radio=1"]),
        ytd-browse yt-lockup-view-model:has(a[href*="list=RD"]),
        ytd-watch-flexy #secondary yt-lockup-view-model:has(a[href*="start_radio=1"]),
        ytd-watch-flexy #secondary yt-lockup-view-model:has(a[href*="list=RD"]) {
            display: none !important;
        }

        /* Backup: the music-note icon in the duration badge. Its own rule,
           so a change here can't break the rules above. */
        ytd-rich-item-renderer:has(badge-shape path[d^="M5.5 1.383V6.88"]),
        ytd-browse yt-lockup-view-model:has(badge-shape path[d^="M5.5 1.383V6.88"]),
        ytd-watch-flexy #secondary yt-lockup-view-model:has(badge-shape path[d^="M5.5 1.383V6.88"]) {
            display: none !important;
        }

        /* YouTube movies ("Free of charge" / price badge, age rating like
           FSK 12). Their own element, the "Commerce" badge style, or a link
           to the official "YouTube Movies & TV" channel. */
        ytd-browse ytd-movie-renderer,
        ytd-browse ytd-grid-movie-renderer,
        ytd-watch-flexy ytd-compact-movie-renderer,
        ytd-rich-item-renderer:has(ytd-movie-renderer),
        ytd-rich-item-renderer:has(badge-shape.ytBadgeShapeCommerce),
        ytd-rich-item-renderer:has(a[href="/channel/UCuVPpxrm2VAgpH3Ktln4HXg"]),
        ytd-browse yt-lockup-view-model:has(badge-shape.ytBadgeShapeCommerce),
        ytd-watch-flexy #secondary yt-lockup-view-model:has(badge-shape.ytBadgeShapeCommerce),
        ytd-watch-flexy #secondary yt-lockup-view-model:has(a[href="/channel/UCuVPpxrm2VAgpH3Ktln4HXg"]) {
            display: none !important;
        }
    `;

    const style = document.createElement('style');
    style.textContent = css + feedCss;
    (document.head || document.documentElement).appendChild(style);
})();
