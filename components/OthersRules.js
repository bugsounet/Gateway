class OthersRules {
  constructor() {
    console.log("|GATEWAY] OthersRules Ready")
  }

  /** Activate automaticaly any plugins **/
  helloEXT(that, module) {
    switch (module) {
      case that.ExtDB.find(name => name === module): //read DB and find module
        that.GW[module].hello= true
        logGW("Hello,", module)
        this.onStartPlugin(that, module)
        break
      default:
        console.warn("[GATEWAY] Hi,", module, "what can i do for you ?")
        break
    }
  }

  /** Rule when a plugin send Hello **/
  onStartPlugin(that, plugin) {
    if (!plugin) return
    if (plugin == "EXT-Background") that.sendNotification("GAv4_FORCE_FULLSCREEN")
    if (plugin == "EXT-Detector") setTimeout(() => that.sendNotification("EXT_DETECTOR-START") , 300)
    if (plugin == "EXT-Pages") that.sendNotification("EXT_PAGES-Gateway")
  }

  /** Connect rules **/
  connectEXT(that, extName) {
    if (!that.GW.ready) return console.error("[GATEWAY] Hey!,", extName, "MMM-GoogleAssistant is not ready")
    if(that.GW["EXT-Screen"].hello && !this.hasPluginConnected(that.GW, "connected", true)) {
      if (!that.GW["EXT-Screen"].power) that.sendNotification("EXT_SCREEN-WAKEUP")
      that.sendNotification("EXT_SCREEN-LOCK")
      if (that.GW["EXT-Motion"].hello && that.GW["EXT-Motion"].started) that.sendNotification("EXT_MOTION-DESTROY")
      if (that.GW["EXT-Pir"].hello && that.GW["EXT-Pir"].started) that.sendNotification("EXT_PIR-STOP")
      if (that.GW["EXT-StreamDeck"].hello) that.sendNotification("EXT_STREAMDECK-ON")
    }

    if (this.browserOrPhotoIsConnected(that)) {
      logGW("Connected:", extName, "[browserOrPhoto Mode]")
      that.GW[extName].connected = true
      this.lockPagesByGW(that,extName)
      that.sendSocketNotification("EXTStatus", that.GW)
      return
    }

    if (that.GW["EXT-Spotify"].hello && that.GW["EXT-Spotify"].connected) that.sendNotification("EXT_SPOTIFY-STOP")
    if (that.GW["EXT-MusicPlayer"].hello && that.GW["EXT-MusicPlayer"].connected) that.sendNotification("EXT_MUSIC-STOP")
    if (that.GW["EXT-RadioPlayer"].hello && that.GW["EXT-RadioPlayer"].connected) that.sendNotification("EXT_RADIO-STOP")
    if (that.GW["EXT-YouTube"].hello && that.GW["EXT-YouTube"].connected) that.sendNotification("EXT_YOUTUBE-STOP")
    if (that.GW["EXT-YouTubeCast"].hello && that.GW["EXT-YouTubeCast"].connected) that.sendNotification("EXT_YOUTUBECAST-STOP")
    if (that.GW["EXT-FreeboxTV"].hello && that.GW["EXT-FreeboxTV"].connected) that.sendNotification("EXT_FREEBOXTV-STOP")

    logGW("Connected:", extName)
    logGW("Debug:", that.GW)
    that.GW[extName].connected = true
    this.lockPagesByGW(that, extName)
  }

  /** disconnected rules **/
  disconnectEXT(that, extName) {
    if (!that.GW.ready) return console.error("[GATEWAY] MMM-GoogleAssistant is not ready")
    if (extName) that.GW[extName].connected = false

    // sport time ... verify if there is again an EXT module connected !
    setTimeout(()=> { // wait 1 sec before scan ...
      if (that.GW["EXT-Screen"].hello && !this.hasPluginConnected(that.GW, "connected", true)) {
        that.sendNotification("EXT_SCREEN-UNLOCK")
        if (that.GW["EXT-Motion"].hello && !that.GW["EXT-Motion"].started) that.sendNotification("EXT_MOTION-INIT")
        if (that.GW["EXT-Pir"].hello && !that.GW["EXT-Pir"].started) that.sendNotification("EXT_PIR-RESTART")
        if (that.GW["EXT-StreamDeck"].hello) that.sendNotification("EXT_STREAMDECK-OFF")
      }
      if (that.GW["EXT-Pages"].hello && !this.hasPluginConnected(that.GW, "connected", true)) that.sendNotification("EXT_PAGES-UNLOCK")
      logGW("Disconnected:", extName)
    }, 1000)
  }

  /** need to lock EXT-Pages ? **/
  lockPagesByGW(that, extName) {
    if (that.GW["EXT-Pages"].hello) {
      if(that.GW[extName].hello && that.GW[extName].connected && typeof that.GW["EXT-Pages"][extName] == "number") {
        that.sendNotification("EXT_PAGES-CHANGED", that.GW["EXT-Pages"][extName])
        that.sendNotification("EXT_PAGES-LOCK")
      }
      else that.sendNotification("EXT_PAGES-PAUSE")
    }
  }

  browserOrPhotoIsConnected(that) {
    if ((that.GW["EXT-Browser"].hello && that.GW["EXT-Browser"].connected) || 
      (that.GW["EXT-Photos"].hello && that.GW["EXT-Photos"].connected)) {
        logGW("browserOrPhoto", true)
        return true
    }
    return false
  }

  /** hasPluginConnected(obj, key, value)
   * obj: object to check
   * key: key to check in deep
   * value: value to check with associated key
   * @bugsounet 09/01/2022
  **/
  hasPluginConnected(obj, key, value) {
    if (typeof obj === 'object' && obj !== null) {
      if (obj.hasOwnProperty(key)) return true
      for (var p in obj) {
        if (obj.hasOwnProperty(p) && this.hasPluginConnected(obj[p], key, value)) {
          //logGW("check", key+":"+value, "in", p)
          if (obj[p][key] == value) {
            //logGW(p, "is connected")
            return true
          }
        }
      }
    }
    return false
  }
}
