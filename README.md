# YouTube Userscripts

A collection of userscripts for YouTube. Works with [Tampermonkey](https://www.tampermonkey.net/), Violentmonkey, or any userscript manager.

## Scripts

| Script | Description |
| --- | --- |
| [Default Speed](scripts/youtube-default-speed.user.js) | Starts every video at 1.30x. You can still change the speed by hand. Skips YouTube Music and live streams. |
| [Simple Auto-Pause](scripts/youtube-auto-pause.user.js) | Stops videos from autoplaying when opened. Once you click or press a key, it stops interfering. |
| [Default 1440p](scripts/youtube-default-1440p.user.js) | Picks 1440p quality, or the closest available resolution. Waits for ads to finish first. |
| [5 Row](scripts/youtube-5-row.user.js) | Shows 5 videos per row on the home and subscriptions grids. CSS only. |
| [Hide Members Only](scripts/youtube-hide-members-only.user.js) | Hides "Members only" and "Members first" videos from grids and lists. Based on a script by Superflyin. |
| [Country Flag](scripts/youtube-country-flag.user.js) | Shows the creator's country flag next to video titles, or 🌐 if the creator hasn't set a country. |

## Install

1. Install a userscript manager extension (e.g. Tampermonkey).
2. Open a script file above, click **Raw**, and your manager will offer to install it.
   Or create a new script in the manager and paste the contents in.

## Notes

- **Country Flag privacy:** this script sends the ID of each video you open to a third-party service (`channel-info.pages.dev`) to look up the country. Results are cached for 7 days.
- The `improvements` branch has reviewed versions of these scripts with bug fixes. They haven't been tested yet. Try them before replacing the versions here.
- These scripts rely on YouTube's page structure, which changes often. If one stops working, the selectors probably need updating.
