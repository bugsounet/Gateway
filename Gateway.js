/**
 ** Module : Gateway
 ** @bugsounet ©07-2023
 ** support: https://forum.bugsounet.fr
 **/

logGW = (...args) => { /* do nothing */ }

Module.register("Gateway", {
  requiresVersion: "2.25.0",
  defaults: {
    debug: false,
    username: "admin",
    password: "admin",
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
    this.session= {}
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
      vi: "translations/vi.json",
      "zh-cn": "translations/zh-cn.json",
      tr: "translations/tr.json"
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
      case "TB_SYSINFO-RESULT":
        this.show_sysinfo(payload)
        break
    }
  },

  /** TelegramBot **/
  EXT_TELBOTCommands: function(commander) {
    commander.add({
      command: 'sysinfo',
      description: this.translate("TB_SYSINFO_DESCRIPTION"),
      callback: 'cmd_sysinfo'
    })
  },

  cmd_sysinfo: function(command,handler) {
    /** try to manage session ... **/
    let chatId = handler.message.chat.id
    let userId = handler.message.from.id
    let messageId = handler.message.message_id
    let sessionId = messageId + ":" + userId + ":" + chatId
    this.session[sessionId] = handler
    this.sendSocketNotification("TB_SYSINFO", sessionId)
  },

  show_sysinfo: function(result) {
    let session = result.sessionId
    let handler = this.session[session]
    if (!handler || !session) return console.error("[Gateway] TB session not found!", handler, session)
    var text = ""
    text += "*" + result['HOSTNAME'] + "*\n\n"
    // version
    text += "*-- " + this.translate("GW_System_Box_Version") + " --*\n"
    text += "*" + "MagicMirror²:* `" + result['VERSION']['MagicMirror'] + "`\n"
    text += "*" + "Electron:* `" + result['VERSION']['ELECTRON'] + "`\n"
    text += "*" + "MagicMirror² " + this.translate("GW_System_NodeVersion") + "* `" + result['VERSION']['NODEMM'] + "`\n"
    text += "*" + this.translate("GW_System_NodeVersion") + "* `" + result['VERSION']['NODECORE'] + "`\n"
    text += "*" + this.translate("GW_System_NPMVersion") + "* `" + result['VERSION']['NPM'] + "`\n"
    text += "*" + this.translate("GW_System_OSVersion") + "* `" + result['VERSION']['OS'] + "`\n"
    text += "*" + this.translate("GW_System_KernelVersion") + "* `" + result['VERSION']['KERNEL'] + "`\n"
    // CPU
    text += "*-- " + this.translate("GW_System_CPUSystem") + " --*\n"
    text += "*" + this.translate("GW_System_TypeCPU") + "* `" + result['CPU']['type'] + "`\n"
    text += "*" + this.translate("GW_System_SpeedCPU") + "* `" + result['CPU']['speed'] + "`\n"
    text += "*" + this.translate("GW_System_CurrentLoadCPU") + "* `" + result['CPU']['usage'] + "%`\n"
    text += "*" + this.translate("GW_System_GovernorCPU") + "* `" + result['CPU']['governor'] + "`\n"
    text += "*" + this.translate("GW_System_TempCPU") + "* `" + (config.units == "metric" ? result['CPU']['temp']["C"] : result['CPU']['temp']["F"]) + "°`\n"
    // memory
    text += "*-- " + this.translate("GW_System_MemorySystem") + " --*\n"
    text += "*" + this.translate("GW_System_TypeMemory") + "* `" + result['MEMORY']['used'] + " / " + result['MEMORY']['total'] + " (" + result['MEMORY']['percent'] + "%)`\n"
    text += "*" + this.translate("GW_System_SwapMemory") + "* `" + result['MEMORY']['swapUsed'] + " / " + result['MEMORY']['swapTotal'] + " (" + result['MEMORY']['swapPercent'] + "%)`\n"
    // network
    text += "*-- " + this.translate("GW_System_NetworkSystem") + " --*\n"
    text += "*" + this.translate("GW_System_IPNetwork") + "* `" + result['NETWORK']['ip'] + "`\n"
    text += "*" + this.translate("GW_System_InterfaceNetwork") + "* `" + result['NETWORK']['name'] + " (" + (result['NETWORK']['type'] == "wired" ? this.translate("TB_SYSINFO_ETHERNET") : this.translate("TB_SYSINFO_WLAN")) + ")`\n"
    if (result['NETWORK']['type'] == "wired") {
      text += "*" + this.translate("GW_System_SpeedNetwork") + "* `" + result['NETWORK']['speed'] + " Mbit/s`\n"
      text += "*" + this.translate("GW_System_DuplexNetwork") + "* `" + result['NETWORK']['duplex'] + "`\n"
    } else {
      text += "*" + this.translate("GW_System_WirelessInfo") + ":*\n"
      text += "*  " + this.translate("GW_System_SSIDNetwork") + "* `" + result['NETWORK']['ssid'] + "`\n"
      text += "*  " + this.translate("GW_System_BitRateNetwork") + "* `" + result['NETWORK']['bitRate'] + " Mb/s`\n"
      text += "*  " + this.translate("GW_System_FrequencyNetwork") + "* `" + result['NETWORK']['frequency'] + " GHz`\n"
      text += "*  " + this.translate("GW_System_TxPowerNetwork") + "* `" + result['NETWORK']['txPower'] + " dBm`\n"
      text += "*  " + this.translate("GW_System_QualityNetwork") + "* `" + result['NETWORK']['linkQuality'] + " (" + result['NETWORK']['maxLinkQuality'] + ")`\n"
      text += "*  " + this.translate("GW_System_SignalNetwork") + "* `" + result['NETWORK']['signalLevel'] + " dBm (" + result['NETWORK']['barLevel'] + ")`\n"
    }
    // storage
    text += "*-- " + this.translate("GW_System_StorageSystem") + " --*\n"
    result['STORAGE'].forEach(partition => {
      for (let [name, values] of Object.entries(partition)) {
        text += "*" + this.translate("GW_System_MountStorage") + " " + name + ":* `" + values.used + " / " + values.size + " (" + values.use + "%)`\n"
      }
    })
    // uptimes
    text += "*-- " + this.translate("GW_System_UptimeSystem") + " --*\n"
    text += "*" + this.translate("GW_System_CurrentUptime") + ":*\n"
    text += "*  " + this.translate("GW_System_System") + "* `" + result['UPTIME']['currentDHM'] + "`\n"
    text += "*  MagicMirror²:* `" + result['UPTIME']['MMDHM'] + "`\n"
    text += "*" + this.translate("GW_System_RecordUptime") + ":*\n"
    text += "*  " + this.translate("GW_System_System") + "* `" + result['UPTIME']['recordCurrentDHM'] + "`\n"
    text += "*  MagicMirror²:* `" + result['UPTIME']['recordMMDHM'] + "`\n"

    handler.reply("TEXT", text, {parse_mode:'Markdown'})
    delete this.session[session]
  }
})
