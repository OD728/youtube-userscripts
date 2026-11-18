// ==UserScript==
// @name         YouTube Clean Sidebar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides "Explore", "More from YouTube", "Report history" and the footer links from the left sidebar.
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    // Each section is recognized by the links inside it, not by its title,
    // so this works no matter which language YouTube is set to.
    const css = `
        /* "Explore": Music, Movies & TV, Live, Gaming, Podcasts, Memberships */
        ytd-guide-section-renderer:has(a[href^="/feed/storefront"]),
        ytd-guide-section-renderer:has(a[href^="/gaming"]),
        ytd-guide-section-renderer:has(a[href^="/podcasts"]),

        /* "More from YouTube": Premium, Music, Kids, Labs */
        ytd-guide-section-renderer:has(a[href*="youtubekids.com"]),
        ytd-guide-section-renderer:has(a[href="/premium"]),

        /* "Report history" entry, plus its section unless Settings is in it too.
           (CSS doesn't allow :has() inside :has(), and one invalid selector
           would cancel this whole rule, so this is kept simple.) */
        ytd-guide-entry-renderer:has(a[href^="/reporthistory"]),
        ytd-guide-entry-renderer:has(a[title="Report history"]),
        ytd-guide-section-renderer:has(a[href^="/reporthistory"]):not(:has(a[href^="/account"])),

        /* Footer: About, Press, Copyright ... Terms, Privacy ... (c) Google LLC */
        ytd-guide-renderer #footer {
            display: none !important;
        }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
})();
