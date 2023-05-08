/** Create GW database **/

class GWDatabase {
  constructor () {
    console.log("[GATEWAY] Database Ready")
  }

  ExtDB() {
    let db = [
      "EXT-Alert",
      "EXT-Background",
      "EXT-Bring",
      "EXT-Browser",
      "EXT-Detector",
      "EXT-FreeboxTV",
      "EXT-GooglePhotos",
      "EXT-Governor",
      "EXT-Internet",
      "EXT-Keyboard",
      "EXT-Librespot",
      "EXT-MusicPlayer",
      "EXT-Motion",
      "EXT-Pages",
      "EXT-Photos",
      "EXT-Pir",
      "EXT-RadioPlayer",
      "EXT-Screen",
      "EXT-ScreenManager",
      "EXT-ScreenTouch",
      "EXT-Selfies",
      "EXT-SelfiesFlash",
      "EXT-SelfiesSender",
      "EXT-SelfiesViewer",
      "EXT-Spotify",
      "EXT-SpotifyCanvasLyrics",
      "EXT-StreamDeck",
      "EXT-TelegramBot",
      "EXT-UpdateNotification",
      "EXT-Volume",
      "EXT-Welcome",
      "EXT-YouTube",
      "EXT-YouTubeCast"
    ]
    return db
  }
  
  async createGW(that) {
    let GW = {
      GA_Ready: false,
      GW_Ready: false
    }
  
    await Promise.all(that.ExtDB.map(Ext=> {
      GW[Ext] = {
        hello: false,
        connected: false
      }
    }))
  
    /** special rules **/
    GW["EXT-Motion"].started = false
    GW["EXT-Pir"].started = false
    GW["EXT-Screen"].power = true
    GW["EXT-UpdateNotification"].update = {}
    GW["EXT-UpdateNotification"].npm = {}
    GW["EXT-Spotify"].remote = false
    GW["EXT-Spotify"].play = false
    GW["EXT-Volume"].speaker = 0
    GW["EXT-Volume"].isMuted = false
    GW["EXT-Volume"].recorder = 0
    GW["EXT-SpotifyCanvasLyrics"].forced = false
    GW["EXT-Pages"].actual = 0
    GW["EXT-Pages"].total = 0
    return GW
  }
}
  
