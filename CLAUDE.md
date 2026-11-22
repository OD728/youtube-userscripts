# CLAUDE.md

YouTube userscripts in `scripts/*.user.js`, for Tampermonkey/Violentmonkey. No build or tests: the user installs and tests in the browser.

## Branches

New versions go on the **`improvements`** branch and are merged to `main` only after the user has tested them. Installed scripts auto-update from `main`, so anything pushed there ships to every user.

## Script header (keep identical across scripts)

`@name`, `@namespace https://github.com/OD728`, `@version`, `@description`, `@author OD728`, `@license`, `@icon` (Google favicon for youtube.com), `@match *://*.youtube.com/*`, `@exclude *://music.youtube.com/*` where it applies, `@grant`, `@homepageURL`, `@supportURL`, and `@downloadURL`/`@updateURL` pointing at `raw.githubusercontent.com/OD728/youtube-userscripts/main/scripts/<file>`.
- **Bump `@version` on every change**, or installed copies won't update.
- 5 Row (based on Dean's work) and Hide Members Only (based on Superflyin's) keep their original authors' terms and credit; everything else is MIT.

## Writing scripts

- YouTube is a single-page app: page load fires once, so re-run on navigation (`yt-navigate-finish`, as Country Flag, Default 1440p and Hide Shorts do) or use CSS / a MutationObserver.
- Selectors break often; prefer YouTube's custom element names and stable attributes over generated classes.
- Hiding rules live in the scripts (Hide Shorts & Playables, Clean Interface), not in a separate YouTube CSS.
- Country Flag sends video IDs to `channel-info.pages.dev` and caches 7 days; the README's privacy note must stay accurate.

## README

Starts with `**YouTube userscripts:**`. Its table lists every script with a one-line description; update it when a script's behaviour changes.
