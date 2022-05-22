/**
 ** Module : Gateway
 ** @bugsounet ©03-2022
 ** support: https://forum.bugsounet.fr
 **/

logGW = (...args) => { /* do nothing */ }

Module.register("Gateway", {
  defaults: {
    debug: true,
    port: 8081,
    username: "admin",
    password: "admin",
    noLogin: false,
    usePM2: false,
    PM2Id: 0
  },

  start: async function () {
    if (this.config.debug) logGW = (...args) => { console.log("[GATEWAY]", ...args) }
    this.ExtDB = [
      "EXT-Alert",
      "EXT-Background",
      "EXT-Bring",
      "EXT-Browser",
      "EXT-Detector",
      "EXT-FreeboxTV",
      "EXT-GooglePhotos",
      "EXT-Governor",
      "EXT-Internet",
      "EXT-Led", // not coded
      "EXT-Librespot",
      "EXT-MusicPlayer",
      "EXT-Photos",
      "EXT-Pir",
      "EXT-RadioPlayer",
      "EXT-Raspotify",
      "EXT-Screen",
      "EXT-ScreenManager",
      "EXT-ScreenTouch",
      "EXT-Spotify",
      "EXT-UpdateNotification",
      "EXT-Volume",
      "EXT-Welcome",
      "EXT-YouTube",
      "EXT-YouTubeCast",
      "EXT-YouTubeVLC"
    ]

    this.GW = {
      ready: false
    }

    await Promise.all(this.ExtDB.map(Ext=> {
      this.GW[Ext] = {
        hello: false,
        connected: false
      }
    }))

    /** special rules **/
    this.GW["EXT-Screen"].power = true

    this.urls = {
      photos: {
        urls: null,
        length: 0
      },
      links: {
        urls: null,
        length: 0
      }
    }
  },

  getTranslations: function() {
    return {
      en: "translations/en.json",
      fr: "translations/fr.json",
      it: "translations/it.json",
      de: "translations/de.json",
      es: "translations/es.json",
      nl: "translations/nl.json",
      pt: "translations/pt.json",
      ko: "translations/ko.json"
    }
  },

  getDom: function() {
    var dom = document.createElement("div")
    dom.style.display = 'none'
    return dom
  },

  notificationReceived: function(noti, payload, sender) {
    if (noti.startsWith("ASSISTANT_")) return this.ActionsOnStatus(noti)
    if (noti.startsWith("EXT_")) return this.ActionsOnExt(noti,payload)
    switch(noti) {
      case "DOM_OBJECTS_CREATED":
        this.sendSocketNotification("INIT", this.config)
        break
      case "GAv4_READY":
        if (sender.name == "MMM-GoogleAssistant") {
          this.GW.ready = true
          logGW("Gateway is ready too!")
        } else {
          console.error("[GATEWAY]", this.sender.name, "Don't try to enforce my rules!")
        }
        break
      case "SHOW_ALERT": // trigger Alert to EXT-Alert module
        if (!this.GW["EXT-Alert"].hello) return
        logGW("Trigger Alert from:", payload)
        this.sendNotification("EXT_ALERT", {
          message: payload.message,
          type: "warning",
          sender: payload.title ? payload.title : sender.name,
          timer: (payload.timer && payload.timer !=0)  ? payload.timer : null
        })
        break
      case "USER_PRESENCE":
        if (!this.GW["EXT-Screen"].hello) return
        this.GW["EXT-Screen"].power = payload ? true : false
        break
    }
  },

  socketNotificationReceived: async function(noti,payload) {
    if (noti== "MMConfig") {
      var GWTranslate = await this.LoadGWTranslation()
      var EXTDescription = await this.LoadDescription()
      var VALTranslate = await this.LoadTrSchemaValidation()
      this.sendSocketNotification("MMConfig", { DB: this.ExtDB, Description: EXTDescription, Translate: GWTranslate, Schema: VALTranslate } )
    }
  },

  /** load translation **/
  LoadGWTranslation: function() {
    return new Promise(resolve => {
      var Tr = {}

      Tr.Rotate_Msg = this.translate("GW_Rotate_Msg"),
      Tr.Rotate_Continue = this.translate("GW_Rotate_Continue"),

      Tr.Login_Welcome = this.translate("GW_Login_Welcome")
      Tr.Login_Username = this.translate("GW_Login_Username")
      Tr.Login_Password = this.translate("GW_Login_Password")

      Tr.Home = this.translate("GW_Home")
      Tr.Home_Welcome= this.translate("GW_Home_Welcome")

      Tr.Plugins = this.translate("GW_Plugins")
      Tr.Plugins_Welcome = this.translate("GW_Plugins_Welcome")
      Tr.Plugins_Table_Reset= this.translate("GW_Plugins_Table_Reset")
      Tr.Plugins_Table_Showing= this.translate("GW_Plugins_Table_Showing")
      Tr.Plugins_Table_Plugins= this.translate("GW_Plugins_Table_Plugins")
      Tr.Plugins_Table_Name= this.translate("GW_Plugins_Table_Name")
      Tr.Plugins_Table_Description= this.translate("GW_Plugins_Table_Description")
      Tr.Plugins_Table_Actions= this.translate("GW_Plugins_Table_Actions")
      Tr.Plugins_Table_Configuration= this.translate("GW_Plugins_Table_Configuration")
      Tr.Plugins_Table_Search= this.translate("GW_Plugins_Table_Search")
      Tr.Plugins_Table_Wiki = this.translate("GW_Plugins_Table_Wiki")
      Tr.Plugins_Table_Install = this.translate("GW_Plugins_Table_Install")
      Tr.Plugins_Table_Delete = this.translate("GW_Plugins_Table_Delete")
      Tr.Plugins_Table_Modify = this.translate("GW_Plugins_Table_Modify")
      Tr.Plugins_Table_Configure = this.translate("GW_Plugins_Table_Configure")
      Tr.Plugins_Table_DeleteConfig = this.translate("GW_Plugins_Table_DeleteConfig")
      Tr.Plugins_Delete_TerminalHeader = this.translate("GW_Plugins_Delete_TerminalHeader")
      Tr.Plugins_Delete_Message = this.translate("GW_Plugins_Delete_Message")
      Tr.Plugins_Delete_Progress = this.translate("GW_Plugins_Delete_Progress")
      Tr.Plugins_Delete_Confirmed = this.translate("GW_Plugins_Delete_Confirmed")
      Tr.Plugins_Install_TerminalHeader = this.translate("GW_Plugins_Install_TerminalHeader")
      Tr.Plugins_Install_Message = this.translate("GW_Plugins_Install_Message")
      Tr.Plugins_Install_Progress = this.translate("GW_Plugins_Install_Progress")
      Tr.Plugins_Install_Confirmed = this.translate("GW_Plugins_Install_Confirmed")
      Tr.Plugins_Initial_Title = this.translate("GW_Plugins_Initial_Title")
      Tr.Plugins_DeleteConfig_Title = this.translate("GW_Plugins_DeleteConfig_Title")
      Tr.Plugins_DeleteConfig_Confirmed = this.translate("GW_Plugins_DeleteConfig_Confirmed")
      Tr.Plugins_Modify_Title = this.translate("GW_Plugins_Modify_Title")

      Tr.Terminal = this.translate("GW_Terminal")

      Tr.Configuration = this.translate("GW_Configuration")
      Tr.Configuration_Welcome = this.translate("GW_Configuration_Welcome")
      Tr.Configuration_EditLoad = this.translate("GW_Configuration_EditLoad")
      Tr.Configuration_Edit_Title = this.translate("GW_Configuration_Edit_Title")
      Tr.Configuration_Edit_AcualConfig = this.translate("GW_Configuration_Edit_AcualConfig")

      Tr.Tools = this.translate("GW_Tools")
      Tr.Tools_Welcome = this.translate("GW_Tools_Welcome")
      Tr.Tools_subTitle = this.translate("GW_Tools_subTitle")
      Tr.Tools_Restart = this.translate("GW_Tools_Restart")
      Tr.Tools_Restart_Text1 = this.translate("GW_Tools_Restart_Text1")
      Tr.Tools_Restart_Text2 = this.translate("GW_Tools_Restart_Text2")
      Tr.Tools_Die = this.translate("GW_Tools_Die")
      Tr.Tools_Die_Text1 = this.translate("GW_Tools_Die_Text1")
      Tr.Tools_Die_Text2 = this.translate("GW_Tools_Die_Text2")
      Tr.Tools_Die_Text3 = this.translate("GW_Tools_Die_Text3")
      Tr.Tools_Webview_Header = this.translate("GW_Tools_Webview_Header")
      Tr.Tools_Webview_Needed = this.translate("GW_Tools_Webview_Needed")
      Tr.Tools_Backup_Found = this.translate("GW_Tools_Backup_Found")
      Tr.Tools_Backup_Text = this.translate("GW_Tools_Backup_Text")
      Tr.Tools_Backup_Deleted = this.translate("GW_Tools_Backup_Deleted")

      Tr.Setting = this.translate("GW_Setting")
      Tr.Setting_Title = this.translate("GW_Setting_Title")
      Tr.Setting_Credentials = this.translate("GW_Setting_Credentials")
      Tr.Setting_Credentials_tooltip = this.translate("GW_Setting_Credentials_tooltip")
      Tr.Setting_Credentials_username = this.translate("GW_Setting_Credentials_username")
      Tr.Setting_Credentials_password = this.translate("GW_Setting_Credentials_password")
      Tr.Setting_Credentials_confirmpwd = this.translate("GW_Setting_Credentials_confirmpwd")
      Tr.Setting_Credentials_username_placeholder = this.translate("GW_Setting_Credentials_username_placeholder")
      Tr.Setting_Credentials_password_placeholder = this.translate("GW_Setting_Credentials_password_placeholder")
      Tr.Setting_Credentials_confirmpwd_placeholder = this.translate("GW_Setting_Credentials_confirmpwd_placeholder")
      Tr.Setting_Server = this.translate("GW_Setting_Server")
      Tr.Setting_Server_debug = this.translate("GW_Setting_Server_debug")
      Tr.Setting_Server_usePM2 = this.translate("GW_Setting_Server_usePM2")
      Tr.Setting_Server_port = this.translate("GW_Setting_Server_port")
      Tr.Setting_Server_PM2Id = this.translate("GW_Setting_Server_PM2Id")
      Tr.Setting_Info_by = this.translate("GW_Setting_Info_by")
      Tr.Setting_Info_Support = this.translate("GW_Setting_Info_Support")
      Tr.Setting_Info_Donate = this.translate("GW_Setting_Info_Donate")
      Tr.Setting_Info_Donate_Text = this.translate("GW_Setting_Info_Donate_Text")
      Tr.Setting_Info_About = this.translate("GW_Setting_Info_About")
      Tr.Setting_Info_Translator = this.translate("GW_Setting_Info_Translator")
      Tr.Setting_Info_Translator1 = this.translate("GW_Setting_Info_Translator1")
      Tr.Setting_Info_Translator2 = this.translate("GW_Setting_Info_Translator2")
      Tr.Setting_Info_Translator3 = this.translate("GW_Setting_Info_Translator3")
      Tr.Setting_Info_Translator4 = this.translate("GW_Setting_Info_Translator4")
      Tr.Setting_Info_Translator5 = this.translate("GW_Setting_Info_Translator5")
      Tr.Setting_Info_Translator6 = this.translate("GW_Setting_Info_Translator6")
      Tr.Setting_Info_Translator7 = this.translate("GW_Setting_Info_Translator7")
      Tr.Setting_Info_Translator8 = this.translate("GW_Setting_Info_Translator8")
      Tr.Setting_Info_Translator9 = this.translate("GW_Setting_Info_Translator9")
      Tr.Setting_Info_Translator10 = this.translate("GW_Setting_Info_Translator10")

      Tr.Logout = this.translate("GW_Logout")

      Tr.Delete = this.translate("GW_Delete"),
      Tr.Install = this.translate("GW_Install"),
      Tr.Configure = this.translate("GW_Configure"),
      Tr.Modify = this.translate("GW_Modify")
      Tr.Save = this.translate("GW_Save")
      Tr.Wait = this.translate("GW_Wait")
      Tr.Done = this.translate("GW_Done")
      Tr.Error = this.translate("GW_Error")
      Tr.Cancel = this.translate("GW_Cancel")
      Tr.Confirm = this.translate("GW_Confirm")
      Tr.Load = this.translate("GW_Load")
      Tr.Restart = this.translate("GW_Restart")
      Tr.ErrModule = this.translate("GW_ErrModule")
      Tr.Warn_Error = this.translate("GW_Warn_Error")
      Tr.LoadDefault = this.translate("GW_LoadDefault"),
      Tr.MergeDefault = this.translate("GW_MergeDefault")

      resolve(Tr)
    })
  },

  /** load descriptions **/
  LoadDescription: function () {
    return new Promise(resolve => {
      var desc = {}
      desc["EXT-Alert"] = this.translate("EXT-Alert"),
      desc["EXT-Background"] = this.translate("EXT-Background"),
      desc["EXT-Bring"] = this.translate("EXT-Bring"),
      desc["EXT-Browser"] = this.translate("EXT-Browser"),
      desc["EXT-Detector"] = this.translate("EXT-Detector"),
      desc["EXT-FreeboxTV"] = this.translate("EXT-FreeboxTV"),
      desc["EXT-GooglePhotos"] = this.translate("EXT-GooglePhotos"),
      desc["EXT-Governor"] = this.translate("EXT-Governor"),
      desc["EXT-Internet"] = this.translate("EXT-Internet"),
      desc["EXT-Led"] = this.translate("EXT-Led"),
      desc["EXT-Librespot"] = this.translate("EXT-Librespot"),
      desc["EXT-MusicPlayer"] = this.translate("EXT-MusicPlayer"),
      desc["EXT-Photos"] = this.translate("EXT-Photos"),
      desc["EXT-Pir"] = this.translate("EXT-Pir"),
      desc["EXT-RadioPlayer"] = this.translate("EXT-RadioPlayer"),
      desc["EXT-Raspotify"] = this.translate("EXT-Raspotify"),
      desc["EXT-Screen"] = this.translate("EXT-Screen"),
      desc["EXT-ScreenManager"] = this.translate("EXT-ScreenManager"),
      desc["EXT-ScreenTouch"] = this.translate("EXT-ScreenTouch"),
      desc["EXT-Spotify"] = this.translate("EXT-Spotify"),
      desc["EXT-UpdateNotification"] = this.translate("EXT-UpdateNotification"),
      desc["EXT-Volume"] = this.translate("EXT-Volume"),
      desc["EXT-Welcome"] = this.translate("EXT-Welcome"),
      desc["EXT-YouTube"] = this.translate("EXT-YouTube"),
      desc["EXT-YouTubeCast"] = this.translate("EXT-YouTubeCast"),
      desc["EXT-YouTubeVLC"] = this.translate("EXT-YouTubeVLC")
      resolve(desc)
    })
  },

  /** load schema validation translations **/
  LoadTrSchemaValidation: function () {
    return new Promise(resolve => {
      var Tr = {}
      Tr.PluginDescription = this.translate("VAL_PluginDescription")
      Tr.PluginName = this.translate("VAL_PluginName")
      Tr.PluginDisable = this.translate("VAL_PluginDisable")
      Tr.PluginPosition = this.translate("VAL_PluginPosition")
      Tr.PluginConfigDeepMerge = this.translate("VAL_PluginConfigDeepMerge")
      Tr.PluginConfiguration = this.translate("VAL_PluginConfiguration")
      Tr.PluginDebug = this.translate("VAL_PluginDebug")
      Tr["EXT-Alert_ignore"] = this.translate("VAL_EXT-Alert_ignore")
      resolve(Tr)
    })
  },

  /***********************/
  /** GA Status Gateway **/
  /***********************/

  ActionsOnStatus: function(status) {
    if (!this.GW.ready) return console.log("[GATEWAY] MMM-GoogleAssistant is not ready")
    logGW("Received GA status:", status)
    switch(status) {
      case "ASSISTANT_LISTEN":
      case "ASSISTANT_THINK":
        if (this.GW["EXT-Detector"].hello) this.sendNotification("EXT_DETECTOR-STOP")
        if(this.GW["EXT-Screen"].hello && !this.hasPluginConnected(this.GW, "connected", true)) {
          if (!this.GW["EXT-Screen"].power) this.sendNotification("EXT_SCREEN-WAKEUP")
          this.sendNotification("EXT_SCREEN-LOCK", { show: true } )
        }
        if (this.GW["EXT-Spotify"].hello && this.GW["EXT-Spotify"].connected) this.sendNotification("EXT_SPOTIFY-VOLUME_MIN")
        if (this.GW["EXT-RadioPlayer"].hello && this.GW["EXT-RadioPlayer"].connected) this.sendNotification("EXT_RADIO-VOLUME_MIN")
        if (this.GW["EXT-MusicPlayer"].hello && this.GW["EXT-MusicPlayer"].connected) this.sendNotification("EXT_MUSIC-VOLUME_MIN")
        if (this.GW["EXT-YouTubeVLC"].hello && this.GW["EXT-YouTubeVLC"].connected) this.sendNotification("EXT_YOUTUBEVLC-VOLUME_MIN")
        if (this.GW["EXT-FreeboxTV"].hello && this.GW["EXT-FreeboxTV"].connected) this.sendNotification("EXT-FREEBOXTV-VOLUME_MIN")
        break
      case "ASSISTANT_STANDBY":
        if (this.GW["EXT-Detector"].hello) this.sendNotification("EXT_DETECTOR-START")
        if(this.GW["EXT-Screen"].hello && !this.hasPluginConnected(this.GW, "connected", true)) {
          this.sendNotification("EXT_SCREEN-UNLOCK", { show: true } )
        }
        if (this.GW["EXT-Spotify"].hello && this.GW["EXT-Spotify"].connected) this.sendNotification("EXT_SPOTIFY-VOLUME_MAX")
        if (this.GW["EXT-RadioPlayer"].hello && this.GW["EXT-RadioPlayer"].connected) this.sendNotification("EXT_RADIO-VOLUME_MAX")
        if (this.GW["EXT-MusicPlayer"].hello && this.GW["EXT-MusicPlayer"].connected) this.sendNotification("EXT_MUSIC-VOLUME_MAX")
        if (this.GW["EXT-YouTubeVLC"].hello && this.GW["EXT-YouTubeVLC"].connected) this.sendNotification("EXT_YOUTUBEVLC-VOLUME_MAX")
        if (this.GW["EXT-FreeboxTV"].hello && this.GW["EXT-FreeboxTV"].connected) this.sendNotification("EXT-FREEBOXTV-VOLUME_MAX")
        break
      case "ASSISTANT_REPLY":
      case "ASSISTANT_CONTINUE":
      case "ASSISTANT_CONFIRMATION":
      case "ASSISTANT_ERROR":
      case "ASSISTANT_HOOK":
        break
    }
  },

  /*****************/
  /** Ext Gateway **/
  /*****************/

  ActionsOnExt: function(noti,payload) {
    switch(noti) {
      case "EXT_HELLO":
        this.helloEXT(payload)
        break
      case "EXT_GATEWAY":
        this.gatewayEXT(payload)
        break
      case "EXT_SCREEN-OFF":
        if (!this.GW["EXT-Screen"].hello) return console.log("[GATEWAY] Warn Screen don't say to me HELLO!")
        this.GW["EXT-Screen"].power = false
        break
      case "EXT_SCREEN-ON":
        if (!this.GW["EXT-Screen"].hello) return console.log("[GATEWAY] Warn Screen don't say to me HELLO!")
        this.GW["EXT-Screen"].power = true
        break
      case "EXT_STOP":
        if (this.GW["EXT-Alert"].hello && this.hasPluginConnected(this.GW, "connected", true)) {
          this.sendNotification("EXT_ALERT", {
            type: "information",
            message: this.translate("EXTStop")
          })
        }
        break
      case "EXT_MUSIC-CONNECTED":
        if (!this.GW["EXT-MusicPlayer"].hello) return console.log("[GATEWAY] Warn MusicPlayer don't say to me HELLO!")
        this.connected("EXT-MusicPlayer")
        break
      case "EXT_MUSIC-DISCONNECTED":
        if (!this.GW["EXT-MusicPlayer"].hello) return console.log("[GATEWAY] Warn MusicPlayer don't say to me HELLO!")
        this.disconnected("EXT-MusicPlayer")
        break
      case "EXT_RADIO-CONNECTED":
        if (!this.GW["EXT-RadioPlayer"].hello) return console.log("[GATEWAY] Warn RadioPlayer don't say to me HELLO!")
        this.connected("EXT-RadioPlayer")
        break
      case "EXT_RADIO-DISCONNECTED":
        if (!this.GW["EXT-RadioPlayer"].hello) return console.log("[GATEWAY] Warn RadioPlayer don't say to me HELLO!")
        this.disconnected("EXT-RadioPlayer")
        break
      case "EXT_SPOTIFY-CONNECTED":
      case "EXT_SPOTIFY-DISCONNECTED":
        /* do nothing because it's just the player! */
        break
      case "EXT_SPOTIFY-PLAYER_CONNECTED":
        if (!this.GW["EXT-Spotify"].hello) return console.error("[GATEWAY] Warn Spotify don't say to me HELLO!")
        this.connected("EXT-Spotify")
        break
      case "EXT_SPOTIFY-PLAYER_DISCONNECTED":
        if (!this.GW["EXT-Spotify"].hello) return console.error("[GATEWAY] Warn Spotify don't say to me HELLO!")
        this.disconnected("EXT-Spotify")
        break
      case "EXT_YOUTUBE-CONNECTED":
        if (!this.GW["EXT-YouTube"].hello) return console.error("[GATEWAY] Warn YouTube don't say to me HELLO!")
        this.connected("EXT-YouTube")
        break
      case "EXT_YOUTUBE-DISCONNECTED":
        if (!this.GW["EXT-YouTube"].hello) return console.error("[GATEWAY] Warn YouTube don't say to me HELLO!")
        this.disconnected("EXT-YouTube")
        break
      case "EXT_YOUTUBEVLC-CONNECTED":
        if (!this.GW["EXT-YouTubeVLC"].hello) return console.error("[GATEWAY] Warn YouTubeVLC don't say to me HELLO!")
        this.connected("EXT-YouTubeVLC")
        break
      case "EXT_YOUTUBEVLC-DISCONNECTED":
        if (!this.GW["EXT-YouTubeVLC"].hello) return console.error("[GATEWAY] Warn YouTubeVLC don't say to me HELLO!")
        this.disconnected("EXT-YouTubeVLC")
        break
      case "EXT_YOUTUBECAST-CONNECTED":
        if (!this.GW["EXT-YouTubeCast"].hello) return console.error("[GATEWAY] Warn YouTubeCast don't say to me HELLO!")
        this.connected("EXT-YouTubeCast")
        break
      case "EXT_YOUTUBECAST-DISCONNECTED":
        if (!this.GW["EXT-YouTubeCast"].hello) return console.error("[GATEWAY] Warn YouTubeCast don't say to me HELLO!")
        this.disconnected("EXT-YouTubeCast")
        break
      case "EXT_BROWSER-CONNECTED":
        if (!this.GW["EXT-Browser"].hello) return console.error("[GATEWAY] Warn Browser don't say to me HELLO!")
        this.connected("EXT-Browser")
        break
      case "EXT_BROWSER-DISCONNECTED":
        if (!this.GW["EXT-Browser"].hello) return console.error("[GATEWAY] Warn Browser don't say to me HELLO!")
        this.disconnected("EXT-Browser")
        break
      case "EXT_FREEBOXTV-CONNECTED":
        if (!this.GW["EXT-FreeboxTV"].hello) return console.error("[GATEWAY] Warn FreeboxTV don't say to me HELLO!")
        this.connected("EXT-FreeboxTV")
        break
      case "EXT_FREEBOXTV-DISCONNECTED":
        if (!this.GW["EXT-FreeboxTV"].hello) return console.error("[GATEWAY] Warn FreeboxTV don't say to me HELLO!")
        this.disconnected("EXT-FreeboxTV")
        break
      case "EXT_PHOTOS-CONNECTED":
        if (!this.GW["EXT-Photos"].hello) return console.error("[GATEWAY] Warn Photos don't say to me HELLO!")
        this.connected("EXT-Photos")
        break
      case "EXT_PHOTOS-DISCONNECTED":
        if (!this.GW["EXT-Photos"].hello) return console.error("[GATEWAY] Warn Photos don't say to me HELLO!")
        this.disconnected("EXT-Photos")
        break
      case "EXT_INTERNET-DOWN":
        if (!this.GW["EXT-Internet"].hello) return console.error("[GATEWAY] Warn Internet don't say to me HELLO!")
        if (this.GW["EXT-Detector"].hello) this.sendNotification("EXT_DETECTOR-STOP")
        if (this.GW["EXT-Spotify"].hello) this.sendNotification("EXT_SPOTIFY-MAIN_STOP")
        if (this.GW["EXT-GooglePhotos"].hello) this.sendNotification("EXT_GOOGLEPHOTOS-STOP")
        break
      case "EXT_INTERNET-UP":
        if (!this.GW["EXT-Internet"].hello) return console.error("[GATEWAY] Warn Internet don't say to me HELLO!")
        if (this.GW["EXT-Detector"].hello) this.sendNotification("EXT_DETECTOR-START")
        if (this.GW["EXT-Spotify"].hello) this.sendNotification("EXT_SPOTIFY-MAIN_START")
        if (this.GW["EXT-GooglePhotos"].hello) this.sendNotification("EXT_GOOGLEPHOTOS-START")
        break
      /** Warn if not in db **/
      default:
        logGW("Sorry, i don't understand what is", noti, payload ? payload : "")
        break
    }
  },

  /** Activate automaticaly any plugins **/
  helloEXT: function(module) {
    switch (module) {
      case this.ExtDB.find(name => name === module): //read DB and find module
        this.GW[module].hello= true
        logGW("Hello,", module)
        this.onStartPlugin(module)
        break
      default:
        console.error("[GATEWAY] Hi,", module, "what can i do for you ?")
        break
    }
  },

  /** Rule when a plugin send Hello **/
  onStartPlugin: function (plugin) {
    if (!plugin) return
    if (plugin == "EXT-Background") this.sendNotification("GAv4_FORCE_FULLSCREEN")
    if (plugin == "EXT-Detector") setTimeout(() => this.sendNotification("EXT_DETECTOR-START") , 300)
  },

  /** connected rules **/
  connected: function(extName) {
    if (!this.GW.ready) return console.error("[GATEWAY] Hey!,", extName, "MMM-GoogleAssistant is not ready")
    if(this.GW["EXT-Screen"].hello && !this.hasPluginConnected(this.GW, "connected", true)) {
      if (!this.GW["EXT-Screen"].power) this.sendNotification("EXT_SCREEN-WAKEUP")
      this.sendNotification("EXT_SCREEN-LOCK")
    }

    if (this.browserOrPhoto()) {
      logGW("Connected:", extName, "[browserOrPhoto Mode]")
      if (this.GW["EXT-YouTubeVLC"].hello && this.GW["EXT-YouTubeVLC"].connected) this.sendNotification("EXT_YOUTUBEVLC-STOP")
      this.GW[extName].connected = true
      return
    }

    if (this.GW["EXT-Spotify"].hello && this.GW["EXT-Spotify"].connected) this.sendNotification("EXT_SPOTIFY-STOP")
    if (this.GW["EXT-MusicPlayer"].hello && this.GW["EXT-MusicPlayer"].connected) this.sendNotification("EXT_MUSIC-STOP")
    if (this.GW["EXT-RadioPlayer"].hello && this.GW["EXT-RadioPlayer"].connected) this.sendNotification("EXT_RADIO-STOP")
    if (this.GW["EXT-YouTube"].hello && this.GW["EXT-YouTube"].connected) this.sendNotification("EXT_YOUTUBE-STOP")
    if (this.GW["EXT-YouTubeVLC"].hello && this.GW["EXT-YouTubeVLC"].connected) this.sendNotification("EXT_YOUTUBEVLC-STOP")
    if (this.GW["EXT-YouTubeCast"].hello && this.GW["EXT-YouTubeCast"].connected) this.sendNotification("EXT_YOUTUBECAST-STOP")
    logGW("Connected:", extName)
    logGW("Debug:", this.GW)
    this.GW[extName].connected = true
  },

  /** disconnected rules **/
  disconnected: function(extName) {
    if (!this.GW.ready) return console.error("[GATEWAY] MMM-GoogleAssistant is not ready")
    if (extName) this.GW[extName].connected = false
    // sport time ... verify if there is again an EXT module connected !
    setTimeout(()=> { // wait 1 sec before scan ...
      if(this.GW["EXT-Screen"].hello && !this.hasPluginConnected(this.GW, "connected", true)) this.sendNotification("EXT_SCREEN-UNLOCK")
      logGW("Disconnected:", extName)
    }, 1000)
  },

  browserOrPhoto: function() {
    if ((this.GW["EXT-Browser"].hello && this.GW["EXT-Browser"].connected) || 
      (this.GW["EXT-Photos"].hello && this.GW["EXT-Photos"].connected)) {
        logGW("browserOrPhoto", true)
        return true
    }
    return false
  },

  /***************/
  /**** Tools ****/
  /***************/

  /** hasPluginConnected(obj, key, value)
   * obj: object to check
   * key: key to check in deep
   * value: value to check with associated key
   * @bugsounet 09/01/2022
  **/
  hasPluginConnected: function(obj, key, value) {
    if (typeof obj === 'object' && obj !== null) {
      if (obj.hasOwnProperty(key)) return true
      for (var p in obj) {
        if (obj.hasOwnProperty(p) && this.hasPluginConnected(obj[p], key, value)) {
          //logGW("check", key+":"+value, "in", p)
          if (obj[p][key] == value) {
            logGW(p, "is connected")
            return true
          }
        }
      }
    }
    return false
  },

  /**********************/
  /** Scan GA Response **/
  /**********************/
  gatewayEXT: function(response) {
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
      }
    }

    // the show must go on !
    this.urls = configMerge({}, this.urls, tmp)
    if(this.urls.photos.length > 0 && this.GW["EXT-Photos"].hello) {
      this.GW["EXT-Photos"].connected = true
      this.sendNotification("EXT_PHOTOS-OPEN", this.urls.photos.urls)
      logGW("Forced connected: EXT-Photos")
    }
    else if (this.urls.links.length > 0) {
      this.urlsScan()
    }
    logGW("Response Structure:", this.urls)
  },

  /** urls scan : dispatch url, youtube, spotify **/
  /** use the FIRST discover link only **/
  urlsScan: function() {
    var firstURL = this.urls.links.urls[0]

    /** YouTube RegExp **/
    var YouTubeLink = new RegExp("youtube\.com\/([a-z]+)\\?([a-z]+)\=([0-9a-zA-Z\-\_]+)", "ig")
    /** Scan Youtube Link **/
    var YouTube = YouTubeLink.exec(firstURL)

    if (YouTube) {
      let Type
      if (YouTube[1] == "watch") Type = "id"
      if (YouTube[1] == "playlist") Type = "playlist"
      if (!Type) return console.log("[GA:EXT:YouTube] Unknow Type !" , YouTube)
      if (this.GW["EXT-YouTube"].hello) {
        if (Type == "playlist") {
          this.sendNotification("EXT_ALERT",{
            message: "EXT_YOUTUBE don't support playlist",
            timer: 5000,
            type: "warning"
          })
          return
        }
        this.sendNotification("EXT_YOUTUBE-PLAY", YouTube[3])
      }
      else if (this.GW["EXT-YouTubeVLC"].hello) {
        this.sendNotification("EXT_YOUTUBEVLC-PLAY", YouTube[3])
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
      if (this.GW["EXT-Spotify"].hello) {
        if (type == "track") {
          // don't know why tracks works only with uris !?
          this.sendNotification("EXT_SPOTIFY-PLAY", {"uris": ["spotify:track:" + id ]})
        }
        else {
          this.sendNotification("EXT_SPOTIFY-PLAY", {"context_uri": "spotify:"+ type + ":" + id})
        }
      }
      return
    }
    // send to Browser
    if (this.GW["EXT-Browser"].hello) {
      // force connexion for rules (don't turn off other EXT)
      this.GW["EXT-Browser"].connected = true
      this.sendNotification("EXT_BROWSER-OPEN", firstURL)
      logGW("Forced connected: EXT-Browser")
    }
  }
})
