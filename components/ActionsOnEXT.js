/*****************/
/** Ext Gateway **/
/*****************/

class ActionsOnEXT {
  constructor () {
    console.log("[GATEWAY] ActionsOnEXT Ready")
  }

  Actions(that,noti,payload,sender) {
    if (!that.GW.GA_Ready) return console.log("[GATEWAY] MMM-GoogleAssistant is not ready")
    if (!that.GW.GW_Ready) return console.log("[GATEWAY] Gateway is not ready")
    switch(noti) {
      case "EXT_HELLO":
        that.OthersRules.helloEXT(that, payload)
        break
      case "EXT_PAGES-Gateway":
        if (sender.name == "EXT-Pages") Object.assign(that.GW["EXT-Pages"], payload)
        break
      case "EXT_GATEWAY":
        this.gatewayEXT(that, payload)
        break
      case "EXT_SCREEN-OFF":
        if (!that.GW["EXT-Screen"].hello) return console.log("[GATEWAY] Warn Screen don't say to me HELLO!")
        that.GW["EXT-Screen"].power = false
        if (that.GW["EXT-Pages"].hello) that.sendNotification("EXT_PAGES-PAUSE")
        break
      case "EXT_SCREEN-ON":
        if (!that.GW["EXT-Screen"].hello) return console.log("[GATEWAY] Warn Screen don't say to me HELLO!")
        that.GW["EXT-Screen"].power = true
        if (that.GW["EXT-Pages"].hello) that.sendNotification("EXT_PAGES-RESUME")
        break
      case "EXT_STOP":
        if (that.GW["EXT-Alert"].hello && that.OthersRules.hasPluginConnected(that.GW, "connected", true)) {
          that.sendNotification("EXT_ALERT", {
            type: "information",
            message: that.translate("EXTStop")
          })
        }
        break
      case "EXT_MUSIC-CONNECTED":
        if (!that.GW["EXT-MusicPlayer"].hello) return console.log("[GATEWAY] Warn MusicPlayer don't say to me HELLO!")
        that.OthersRules.connectEXT(that,"EXT-MusicPlayer")
        break
      case "EXT_MUSIC-DISCONNECTED":
        if (!that.GW["EXT-MusicPlayer"].hello) return console.log("[GATEWAY] Warn MusicPlayer don't say to me HELLO!")
        that.OthersRules.disconnectEXT(that,"EXT-MusicPlayer")
        break
      case "EXT_RADIO-CONNECTED":
        if (!that.GW["EXT-RadioPlayer"].hello) return console.log("[GATEWAY] Warn RadioPlayer don't say to me HELLO!")
        that.OthersRules.connectEXT(that,"EXT-RadioPlayer")
        break
      case "EXT_RADIO-DISCONNECTED":
        if (!that.GW["EXT-RadioPlayer"].hello) return console.log("[GATEWAY] Warn RadioPlayer don't say to me HELLO!")
        that.OthersRules.disconnectEXT(that,"EXT-RadioPlayer")
        break
      case "EXT_SPOTIFY-CONNECTED":
        if (!that.GW["EXT-Spotify"].hello) return console.error("[GATEWAY] Warn Spotify don't say to me HELLO!")
        that.GW["EXT-Spotify"].remote = true
        if (that.GW["EXT-SpotifyCanvasLyrics"].hello && that.GW["EXT-SpotifyCanvasLyrics"].forced) that.OthersRules.connectEXT(that,"EXT-SpotifyCanvasLyrics")
        break
      case "EXT_SPOTIFY-DISCONNECTED":
        if (!that.GW["EXT-Spotify"].hello) return console.error("[GATEWAY] Warn Spotify don't say to me HELLO!")
        that.GW["EXT-Spotify"].remote = false
        if (that.GW["EXT-SpotifyCanvasLyrics"].hello && that.GW["EXT-SpotifyCanvasLyrics"].forced) that.OthersRules.disconnectEXT(that,"EXT-SpotifyCanvasLyrics")
        break
      case "EXT_SPOTIFY-PLAYING":
        if (!that.GW["EXT-Spotify"].hello) return console.error("[GATEWAY] Warn Spotify don't say to me HELLO!")
        that.GW["EXT-Spotify"].play = payload
        break
      case "EXT_SPOTIFY-PLAYER_CONNECTED":
        if (!that.GW["EXT-Spotify"].hello) return console.error("[GATEWAY] Warn Spotify don't say to me HELLO!")
        that.OthersRules.connectEXT(that,"EXT-Spotify")
        break
      case "EXT_SPOTIFY-PLAYER_DISCONNECTED":
        if (!that.GW["EXT-Spotify"].hello) return console.error("[GATEWAY] Warn Spotify don't say to me HELLO!")
        that.OthersRules.disconnectEXT(that,"EXT-Spotify")
        break
      case "EXT_YOUTUBE-CONNECTED":
        if (!that.GW["EXT-YouTube"].hello) return console.error("[GATEWAY] Warn YouTube don't say to me HELLO!")
        that.OthersRules.connectEXT(that,"EXT-YouTube")
        break
      case "EXT_YOUTUBE-DISCONNECTED":
        if (!that.GW["EXT-YouTube"].hello) return console.error("[GATEWAY] Warn YouTube don't say to me HELLO!")
        that.OthersRules.disconnectEXT(that,"EXT-YouTube")
        break
      case "EXT_YOUTUBECAST-CONNECTED":
        if (!that.GW["EXT-YouTubeCast"].hello) return console.error("[GATEWAY] Warn YouTubeCast don't say to me HELLO!")
        that.OthersRules.connectEXT(that,"EXT-YouTubeCast")
        break
      case "EXT_YOUTUBECAST-DISCONNECTED":
        if (!that.GW["EXT-YouTubeCast"].hello) return console.error("[GATEWAY] Warn YouTubeCast don't say to me HELLO!")
        that.OthersRules.disconnectEXT(that,"EXT-YouTubeCast")
        break
      case "EXT_BROWSER-CONNECTED":
        if (!that.GW["EXT-Browser"].hello) return console.error("[GATEWAY] Warn Browser don't say to me HELLO!")
        that.OthersRules.connectEXT(that,"EXT-Browser")
        break
      case "EXT_BROWSER-DISCONNECTED":
        if (!that.GW["EXT-Browser"].hello) return console.error("[GATEWAY] Warn Browser don't say to me HELLO!")
        that.OthersRules.disconnectEXT(that,"EXT-Browser")
        break
      case "EXT_FREEBOXTV-CONNECTED":
        if (!that.GW["EXT-FreeboxTV"].hello) return console.error("[GATEWAY] Warn FreeboxTV don't say to me HELLO!")
        that.OthersRules.connectEXT(that,"EXT-FreeboxTV")
        break
      case "EXT_FREEBOXTV-DISCONNECTED":
        if (!that.GW["EXT-FreeboxTV"].hello) return console.error("[GATEWAY] Warn FreeboxTV don't say to me HELLO!")
        that.OthersRules.disconnectEXT(that,"EXT-FreeboxTV")
        break
      case "EXT_PHOTOS-CONNECTED":
        if (!that.GW["EXT-Photos"].hello) return console.error("[GATEWAY] Warn Photos don't say to me HELLO!")
        that.OthersRules.connectEXT(that,"EXT-Photos")
        break
      case "EXT_PHOTOS-DISCONNECTED":
        if (!that.GW["EXT-Photos"].hello) return console.error("[GATEWAY] Warn Photos don't say to me HELLO!")
        that.OthersRules.disconnectEXT(that,"EXT-Photos")
        break
      case "EXT_INTERNET-DOWN":
        if (!that.GW["EXT-Internet"].hello) return console.error("[GATEWAY] Warn Internet don't say to me HELLO!")
        if (that.GW["EXT-Detector"].hello) that.sendNotification("EXT_DETECTOR-STOP")
        if (that.GW["EXT-Spotify"].hello) that.sendNotification("EXT_SPOTIFY-MAIN_STOP")
        if (that.GW["EXT-GooglePhotos"].hello) that.sendNotification("EXT_GOOGLEPHOTOS-STOP")
        break
      case "EXT_INTERNET-UP":
        if (!that.GW["EXT-Internet"].hello) return console.error("[GATEWAY] Warn Internet don't say to me HELLO!")
        if (that.GW["EXT-Detector"].hello) that.sendNotification("EXT_DETECTOR-START")
        if (that.GW["EXT-Spotify"].hello) that.sendNotification("EXT_SPOTIFY-MAIN_START")
        if (that.GW["EXT-GooglePhotos"].hello) that.sendNotification("EXT_GOOGLEPHOTOS-START")
        break
      case "EXT_UN-MODULE_UPDATE": /** Need UN review ! send info before init ! **/
        if (!that.GW || !that.GW["EXT-UpdateNotification"].hello) return console.error("[GATEWAY] Warn UN don't say to me HELLO!")
        that.GW["EXT-UpdateNotification"].module = payload
        break
      case "EXT_UN-NPM_UPDATE":
        if (!that.GW || !that.GW["EXT-UpdateNotification"].hello) return console.error("[GATEWAY] Warn UN don't say to me HELLO!")
        that.GW["EXT-UpdateNotification"].npm = payload
        break
      case "EXT_VOLUME_GET":
        if (!that.GW["EXT-Volume"].hello) return console.error("[GATEWAY] Warn Volume don't say to me HELLO!")
        that.GW["EXT-Volume"].speaker = payload.Speaker
        that.GW["EXT-Volume"].isMuted = payload.SpeakerIsMuted
        that.GW["EXT-Volume"].recorder = payload.Recorder
        break
      case "EXT_SPOTIFY-SCL_FORCED":
        if (!that.GW["EXT-SpotifyCanvasLyrics"].hello) return console.error("[GATEWAY] Warn Spotify don't say to me HELLO!")
        that.GW["EXT-SpotifyCanvasLyrics"].forced = payload
        if (that.GW["EXT-SpotifyCanvasLyrics"].forced && that.GW["EXT-Spotify"].remote && that.GW["EXT-Spotify"].play) that.OthersRules.connectEXT(that,"EXT-SpotifyCanvasLyrics")
        if (!that.GW["EXT-SpotifyCanvasLyrics"].forced && that.GW["EXT-SpotifyCanvasLyrics"].connected) that.OthersRules.disconnectEXT(that,"EXT-SpotifyCanvasLyrics")
        break
      case "EXT_MOTION-STARTED":
        if (!that.GW["EXT-Motion"].hello) return console.error("[GATEWAY] Warn Motion don't say to me HELLO!")
        that.GW["EXT-Motion"].started = true
        break
      case "EXT_MOTION-STOPPED":
        if (!that.GW["EXT-Motion"].hello) return console.error("[GATEWAY] Warn Motion don't say to me HELLO!")
        that.GW["EXT-Motion"].started = false
        break
      case "EXT_PIR-STARTED":
        if (!that.GW["EXT-Pir"].hello) return console.error("[GATEWAY] Warn Pir don't say to me HELLO!")
        that.GW["EXT-Pir"].started = true
        break
      case "EXT_PIR-STOPPED":
        if (!that.GW["EXT-Pir"].hello) return console.error("[GATEWAY] Warn Pir don't say to me HELLO!")
        that.GW["EXT-Pir"].started = false
        break
      case "EXT_SELFIES-START":
        if (!that.GW["EXT-Selfies"].hello) return console.error("[GATEWAY] Warn Selfies don't say to me HELLO!")
        that.OthersRules.connectEXT(that,"EXT-Selfies")
        if (that.GW["EXT-Motion"].hello && that.GW["EXT-Motion"].started) that.sendNotification("EXT_MOTION-DESTROY")
        break
      case "EXT_SELFIES-END":
        if (!that.GW["EXT-Selfies"].hello) return console.error("[GATEWAY] Warn Selfies don't say to me HELLO!")
        that.OthersRules.disconnectEXT(that,"EXT-Selfies")
        if (that.GW["EXT-Motion"].hello && !that.GW["EXT-Motion"].started) that.sendNotification("EXT_MOTION-INIT")
        break
      case "EXT_PAGES-NUMBER_IS":
        if (!that.GW["EXT-Pages"].hello) return console.error("[GATEWAY] Warn Pages don't say to me HELLO!")
        that.GW["EXT-Pages"].actual = payload.Actual
        that.GW["EXT-Pages"].total = payload.Total
        break
      case "EXT_GATEWAY-REBOOT": // only available with EXT-SmarHome
        if (!that.GW["EXT-SmartHome"].hello) return
        if (sender.name == "EXT-SmartHome") that.sendSocketNotification("Restart")
        break
      case "EXT_SCREEN-GH_FORCE_WAKEUP":
        // temp patch ... to do better
        if (that.GW["EXT-Screen"].hello && that.OthersRules.hasPluginConnected(that.GW, "connected", true)) {
          setTimeout(() => { that.sendNotification("EXT_SCREEN-LOCK") } , 500)
        }
      /** Warn if not in db **/
      default:
        logGW("Sorry, i don't understand what is", noti, payload || "")
        break
    }
    that.sendSocketNotification("EXTStatus", that.GW)
    //console.log("!!EXTs Status", that.GW)
  }

  /**********************/
  /** Scan GA Response **/
  /**********************/
  gatewayEXT(that, response) {
    if (!response) return // @todo scan if type array ??
    logGW("Response Scan")
    let tmp = {
      photos: {
        urls: response.photos && response.photos.length ? response.photos : [],
        length: response.photos && response.photos.length ? response.photos.length : 0
      },
      links: {
        urls: response.urls && response.urls.length ?  response.urls : [],
        length: response.urls && response.urls.length ? response.urls.length : 0
      },
      youtube: response.youtube
    }

    // the show must go on !
    var urls = configMerge({}, urls, tmp)
    if(urls.photos.length > 0 && that.GW["EXT-Photos"].hello) {
      that.GW["EXT-Photos"].connected = true
      that.sendNotification("EXT_PHOTOS-OPEN", urls.photos.urls)
      logGW("Forced connected: EXT-Photos")
    }
    else if (urls.links.length > 0) {
      this.urlsScan(that, urls)
    } else if (urls.youtube && that.GW["EXT-YouTube"].hello) {
      that.sendNotification("EXT_YOUTUBE-SEARCH", urls.youtube)
      logGW("Sended to YT", urls.youtube)
    }
    logGW("Response Structure:", urls)
  }

  /** urls scan : dispatch url, youtube, spotify **/
  /** use the FIRST discover link only **/
  urlsScan(that, urls) {
    var firstURL = urls.links.urls[0]

    /** YouTube RegExp **/
    var YouTubeLink = new RegExp("youtube\.com\/([a-z]+)\\?([a-z]+)\=([0-9a-zA-Z\-\_]+)", "ig")
    /** Scan Youtube Link **/
    var YouTube = YouTubeLink.exec(firstURL)

    if (YouTube) {
      let Type
      if (YouTube[1] == "watch") Type = "id"
      if (YouTube[1] == "playlist") Type = "playlist"
      if (!Type) return console.log("[GA:EXT:YouTube] Unknow Type !" , YouTube)
      if (that.GW["EXT-YouTube"].hello) {
        if (Type == "playlist") {
          that.sendNotification("EXT_ALERT",{
            message: "EXT_YOUTUBE don't support playlist",
            timer: 5000,
            type: "warning"
          })
          return
        }
        that.sendNotification("EXT_YOUTUBE-PLAY", YouTube[3])
      }
      return
    }

    /** scan spotify links **/
    /** Spotify RegExp **/
    var SpotifyLink = new RegExp("open\.spotify\.com\/([a-z]+)\/([0-9a-zA-Z\-\_]+)", "ig")
    var Spotify = SpotifyLink.exec(firstURL)
    if (Spotify) {
      let type = Spotify[1]
      let id = Spotify[2]
      if (that.GW["EXT-Spotify"].hello) {
        if (type == "track") {
          // don't know why tracks works only with uris !?
          that.sendNotification("EXT_SPOTIFY-PLAY", {"uris": ["spotify:track:" + id ]})
        }
        else {
          that.sendNotification("EXT_SPOTIFY-PLAY", {"context_uri": "spotify:"+ type + ":" + id})
        }
      }
      return
    }
    // send to Browser
    if (that.GW["EXT-Browser"].hello) {
      // force connexion for rules (don't turn off other EXT)
      that.GW["EXT-Browser"].connected = true
      that.sendNotification("EXT_BROWSER-OPEN", firstURL)
      logGW("Forced connected: EXT-Browser")
    }
  }
}
