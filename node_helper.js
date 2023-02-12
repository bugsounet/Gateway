"use strict"

var log = (...args) => { /* do nothing */ }
var parseData = require("./components/parseData.js")
var NodeHelper = require("node_helper")

module.exports = NodeHelper.create({
  start: function () {
    this.Gateway = {
      MMConfig: null, // real config file (config.js)
      EXT: null, // EXT plugins list
      EXTDescription: {}, // description of EXT
      EXTConfigured: [], // configured EXT in config
      EXTInstalled: [], // installed EXT in MM
      EXTStatus: {}, // status of EXT
      user: { _id: 1, username: 'admin', password: 'admin' },
      initialized: false,
      app: null,
      server: null,
      translation: null,
      schemaTranslatation: null,
      language: null,
      webviewTag: false,
      GACheck: { find: false, version: 0, configured: false },
      GAConfig: {},
      HyperWatch: null,
      radio: null,
      freeteuse: {}
    }
    this.SmartHome = {
      lang: "en",
      use: false,
      init: false,
      last_code: null,
      last_code_user: null,
      last_code_time: null,
      user: { user: "admin", password: "admin", devices: [ "MMM-GoogleAssistant" ] },
      actions: null,
      device: {},
      EXT: {},
      smarthome: {},
      oldSmartHome: {},
      homegraph: null
    }
    this.lib = { error: 0 }
  },

  socketNotificationReceived: async function (noti, payload) {
    switch (noti) {
      case "INIT":
        console.log("[GATEWAY] Gateway Version:", require('./package.json').version, "rev:", require('./package.json').rev)
        if (this.Gateway.server) return
        this.config = payload
        if (this.config.debug) log = (...args) => { console.log("[GATEWAY]", ...args) }
        this.sendSocketNotification("MMConfig")
        break
      case "MMConfig":
        await parseData.parse(this,payload)
        if (this.lib.error) return
        this.lib.Gateway.initialize(this)
        if (this.config.CLIENT_ID) this.lib.SmartHome.initialize(this)
        else this.lib.SmartHome.disable(this)
        this.lib.Gateway.startServer(this)
        break
      case "EXTStatus":
        if (this.Gateway.initialized && payload) {
          this.Gateway.EXTStatus = payload
          if (this.SmartHome.use) {
            if (this.SmartHome.init) {
              this.lib.Device.refreshData(this)
              this.lib.homegraph.updateGraph(this)
            }
          }
        }
        break
    }
  }
})
