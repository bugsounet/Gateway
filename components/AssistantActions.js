/***********************/
/** GA Status Gateway **/
/***********************/
class AssistantActions {
  constructor () {
    console.log("[GATEWAY] AssistantActions Ready")
  }

  Actions(that, status) {
    if (!that.GW.GA_Ready) return console.log("[GATEWAY] MMM-GoogleAssistant is not ready")
    if (!that.GW.GW_Ready) return console.log("[GATEWAY] Gateway is not ready")
    logGW("Received GA status:", status)
    switch(status) {
      case "ASSISTANT_LISTEN":
      case "ASSISTANT_THINK":
        if (that.GW["EXT-Detector"].hello) that.sendNotification("EXT_DETECTOR-STOP")
        if (that.GW["EXT-Screen"].hello && !that.OthersRules.hasPluginConnected(that.GW, "connected", true)) {
          if (!that.GW["EXT-Screen"].power) that.sendNotification("EXT_SCREEN-WAKEUP")
          that.sendNotification("EXT_SCREEN-LOCK", { show: true } )
          if (that.GW["EXT-Motion"].hello && that.GW["EXT-Motion"].started) that.sendNotification("EXT_MOTION-DESTROY")
          if (that.GW["EXT-Pir"].hello && that.GW["EXT-Pir"].started) that.sendNotification("EXT_PIR-STOP")
          if (that.GW["EXT-StreamDeck"].hello) that.sendNotification("EXT_STREAMDECK-ON")
        }
        if (that.GW["EXT-Pages"].hello && !that.OthersRules.hasPluginConnected(that.GW, "connected", true)) that.sendNotification("EXT_PAGES-PAUSE")
        if (that.GW["EXT-Spotify"].hello && that.GW["EXT-Spotify"].connected) that.sendNotification("EXT_SPOTIFY-VOLUME_MIN")
        if (that.GW["EXT-RadioPlayer"].hello && that.GW["EXT-RadioPlayer"].connected) that.sendNotification("EXT_RADIO-VOLUME_MIN")
        if (that.GW["EXT-MusicPlayer"].hello && that.GW["EXT-MusicPlayer"].connected) that.sendNotification("EXT_MUSIC-VOLUME_MIN")
        if (that.GW["EXT-FreeboxTV"].hello && that.GW["EXT-FreeboxTV"].connected) that.sendNotification("EXT_FREEBOXTV-VOLUME_MIN")
        if (that.GW["EXT-YouTube"].hello && that.GW["EXT-YouTube"].connected) that.sendNotification("EXT_YOUTUBE-VOLUME_MIN")
        break
      case "ASSISTANT_STANDBY":
        if (that.GW["EXT-Detector"].hello) that.sendNotification("EXT_DETECTOR-START")
        if (that.GW["EXT-Screen"].hello && !that.OthersRules.hasPluginConnected(that.GW, "connected", true)) {
          that.sendNotification("EXT_SCREEN-UNLOCK", { show: true } )
          if (that.GW["EXT-Motion"].hello && !that.GW["EXT-Motion"].started) that.sendNotification("EXT_MOTION-INIT")
          if (that.GW["EXT-Pir"].hello && !that.GW["EXT-Pir"].started) that.sendNotification("EXT_PIR-START")
          if (that.GW["EXT-StreamDeck"].hello) that.sendNotification("EXT_STREAMDECK-OFF")
        }
        if (that.GW["EXT-Pages"].hello && !that.OthersRules.hasPluginConnected(that.GW, "connected", true)) that.sendNotification("EXT_PAGES-RESUME")
        if (that.GW["EXT-Spotify"].hello && that.GW["EXT-Spotify"].connected) that.sendNotification("EXT_SPOTIFY-VOLUME_MAX")
        if (that.GW["EXT-RadioPlayer"].hello && that.GW["EXT-RadioPlayer"].connected) that.sendNotification("EXT_RADIO-VOLUME_MAX")
        if (that.GW["EXT-MusicPlayer"].hello && that.GW["EXT-MusicPlayer"].connected) that.sendNotification("EXT_MUSIC-VOLUME_MAX")
        if (that.GW["EXT-FreeboxTV"].hello && that.GW["EXT-FreeboxTV"].connected) that.sendNotification("EXT_FREEBOXTV-VOLUME_MAX")
        if (that.GW["EXT-YouTube"].hello && that.GW["EXT-YouTube"].connected) that.sendNotification("EXT_YOUTUBE-VOLUME_MAX")
        break
      case "ASSISTANT_REPLY":
      case "ASSISTANT_CONTINUE":
      case "ASSISTANT_CONFIRMATION":
      case "ASSISTANT_ERROR":
      case "ASSISTANT_HOOK":
        break
    }
  }
}

