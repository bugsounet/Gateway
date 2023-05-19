/**
 ** Module : Gateway
 ** @bugsounet ©03-2023
 ** support: https://forum.bugsounet.fr
 **/

/** bug a inspecter:
 * SH desactiver
 * lancer Spotify
 * SH activer
**/

logGW = (...args) => { /* do nothing */ }

Module.register("Gateway", {
  requiresVersion: "2.22.0",
  defaults: {
    debug: false,
    username: "admin",
    password: "admin",
    usePM2: false,
    PM2Id: 0,
    CLIENT_ID: null
  },

  start: async function () {
    if (this.config.debug) logGW = (...args) => { console.log("[GATEWAY]", ...args) }
    this.callbacks = new callbacks()
    this.AssistantActions = new AssistantActions()
    this.ActionsOnEXT = new ActionsOnEXT()
    this.OthersRules = new OthersRules()
    let GWDB = new GWDatabase()
    this.ExtDB = GWDB.ExtDB()
    this.GW = await GWDB.createGW(this)
    this.awaitGATimer = null
    this.sendSocketNotification("INIT", this.config)
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
      ko: "translations/ko.json",
      el: "translations/el.json",
      vi: "translation/vi.json"
    }
  },

  getScripts: function() {
    return [
      "/modules/Gateway/components/translations.js",
      "/modules/Gateway/components/AssistantActions.js",
      "/modules/Gateway/components/ActionsOnEXT.js",
      "/modules/Gateway/components/OthersRules.js",
      "/modules/Gateway/components/GWDatabase.js",
      "/modules/Gateway/components/callbacks.js"
    ]
  },

  getDom: function() {
    var dom = document.createElement("div")
    dom.style.display = 'none'
    return dom
  },

  notificationReceived: function(noti, payload, sender) {
    if (noti.startsWith("ASSISTANT_")) return this.AssistantActions.Actions(this,noti)
    if (noti.startsWith("EXT_")) return this.ActionsOnEXT.Actions(this,noti,payload,sender)
    switch(noti) {
      case "GA_READY":
        if (sender.name == "MMM-GoogleAssistant") {
          this.GW.GA_Ready = true
          this.sendSocketNotification("HELLO", "MMM-GoogleAssistant")
          logGW("Hello, MMM-GoogleAssistant")
        }
        else console.error("[GATEWAY]", this.sender.name, "Don't try to enforce my rules!")
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
    }
  },

  socketNotificationReceived: async function(noti,payload) {
    if (noti.startsWith("CB_")) return this.callbacks.cb(this,noti,payload)
    switch(noti) {
      case "MMConfig":
        let LoadTranslate = new GWTranslations()
        let GWTranslate = await LoadTranslate.LoadGWTranslation(this)
        let EXTDescription = await LoadTranslate.LoadGWDescription(this)
        let VALTranslate = await LoadTranslate.LoadGWTrSchemaValidation(this)
        this.sendSocketNotification("MMConfig", { DB: this.ExtDB, Description: EXTDescription, Translate: GWTranslate, Schema: VALTranslate, EXTStatus: this.GW } )
        break
      case "WARNING": // EXT-Alert is unlocked for receive all alerts
        this.sendNotification("EXT_ALERT", {
          type: "warning",
          message: "Error When Loading: " + payload.library + ". Try to solve it with `npm run rebuild` in Gateway directory",
          timer: 10000
        })
        break
      case "ERROR": // EXT-Alert is unlocked for receive all alerts
        this.sendNotification("EXT_ALERT", {
          type: "error",
          message: "Error: " + payload,
          timer: 60000
        })
        break
      case "INITIALIZED":
        this.OthersRules.awaitGATimer(this)
        break
      case "SendNoti":
        if (payload.payload && payload.noti) this.sendNotification(payload.noti, payload.payload)
        else this.sendNotification(payload)
        break
      case "SendStop":
        this.ActionsOnEXT.Actions(this, "EXT_STOP")
        break
    }
  }
})
