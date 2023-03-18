# Gateway

`MMM-GoogleAssistant` need an gateway for comunicate with plugins.<br>
So `Gateway` will doing this job !

# Why `Gateway` is needed ?

When you use an some media modules  (music, video, photos,...) some weird things can happen
I think, many people have this problem:
 * I can run 2 media modules at the time
 * pir sensor don't detect media... so screen turn off
 
So `Gateway` is your fiend

Gateway is able to:
 * Lock your screen when a plugins is playing and prohibit going into sleep mode
 * Prohibit to use 2 plugins in sametime (can't listen Spotify and watch YouTube at the same time for exemple)
 * Turn off all not needed plugins and keep the last plugin demand
 * Unlock your screen and return in normal mode when no plugins are used
 * Read MMM-GoogleAssistant response and launch automaticaly a plugins (photo, browser, youtube...)


All name of `MMM-GoogleAssistant` plugins start with `EXT` and the `Gateway` will apply many rules for make deal between `MMM-GoogleAssistant` and plugins

`Gateway` have a database of ALL `EXT` plugins for apply self rules.

`MMM-GoogleAssistant` 💭 -> Gateway 🎼 <-> EXT plugins 🎹

Gateway is a real conductor 🙂

# Gateway v3.x.x
  Gateway has an embedded application.<br>
  This application is available directly through your browser.<br>
  It can be used locally or remotely over the internet.<br>
 
  * Allows to Install / delete all EXT plugins
  * Allows to configure / modify your EXT with a template
  * Allows to configure MagicMirror
  * Allows you to create a backup of your configuration file at each modification
  * Displaying Magic Mirror Logs in real time
  * allows you to do now operations with the embedded Terminal
  * Allows you to manually restart or stop MagicMirror
  * Allows you to turn off or turn on your screen
  * ...

  Gateway have also an embedded smarthome controler !

  * Able to control:
    - EXT-Screen
    - EXT-Pages
    - EXT-Spotify
    - EXT-Volume
    - ...
  * Controling MagicMirror from GoogleHome app (smartphone)
  * Controling Magicmirror from any google assistant

# Installation / update / configuration

Read the docs in [wiki](https://wiki.bugsounet.fr/Gateway)

# Support and Helping
New forum and support for all @bugsounet modules is now localized [there](https://forum.bugsounet.fr) !
 
# Donate
 [Donate](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TTHRH94Y4KL36&source=url), if you love this module !
