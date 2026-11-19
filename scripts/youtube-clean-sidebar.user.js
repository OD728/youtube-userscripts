// ==UserScript==
// @name         YouTube Clean Interface
// @namespace    https://github.com/OD728
// @version      1.1.0
// @description  Hides clutter: sidebar extras (Explore, More from YouTube, Report history, footer), header buttons, video action buttons and AI/transcript extras.
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
    `;

    const style = document.createElement('style');
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
})();
