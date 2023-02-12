/**
 ** Module : Gateway
 ** @bugsounet ©02-2023
 ** support: https://forum.bugsounet.fr
 **/

/** bug a inspecter:
 * SH desactiver
 * lancer Spotify
 * SH activer
**/

logGW = (...args) => { /* do nothing */ }

Module.register("Gateway", {
  defaults: {
    debug: false,
    username: "admin",
    password: "admin",
    usePM2: false,
    PM2Id: 0,
    useHomeGraph: false,
    CLIENT_ID: null
  },

  start: async function () {
    if (this.config.debug) logGW = (...args) => { console.log("[GATEWAY]", ...args) }
    this.ExtDB = ExtDB()
    this.GW = await createGW(this)
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
      el: "translations/el.json"
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
    if (noti.startsWith("ASSISTANT_")) return ActionsOnStatusOfGA(this,noti)
    if (noti.startsWith("EXT_")) return ActionsOnEXT(this,noti,payload,sender)
    switch(noti) {
      case "DOM_OBJECTS_CREATED":
        this.config.lang = getGWLanguageBeforeInit()
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
    }
  },

  socketNotificationReceived: async function(noti,payload) {
    if (noti.startsWith("CB_")) return SH_Callbacks(this,noti,payload)
    switch(noti) {
      case "MMConfig":
        var GWTranslate = await LoadGWTranslation(this)
        var EXTDescription = await LoadGWDescription(this)
        var VALTranslate = await LoadGWTrSchemaValidation(this)
        this.sendSocketNotification("MMConfig", { DB: this.ExtDB, Description: EXTDescription, Translate: GWTranslate, Schema: VALTranslate, EXTStatus: this.GW } )
        break
      case "WARNING":
        if (this.GW["EXT-Alert"].hello) {
          this.sendNotification("EXT_ALERT", {
            type: "warning",
            message: "Error When Loading: " + payload.library + ". Try to solve it with `npm run rebuild` in Gateway directory",
            timer: 10000
          })
        } else {
          this.sendNotification("SHOW_ALERT", {
            type: "notification",
            message: "Error When Loading: " + payload.library + ". Try to solve it with `npm run rebuild` in Gateway directory",
            title: "Gateway",
            timer: 10000
          })
        }
        break
      case "SendNoti":
        if (payload.payload && payload.noti) {
           return this.sendNotification(payload.noti, payload.payload)
        }
        this.sendNotification(payload)
        break
      case "SendStop":
        ActionsOnEXT(this, "EXT_STOP")
        break
    }
  }
})
