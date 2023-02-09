"use strict"

var NodeHelper = require("node_helper")
var log = (...args) => { /* do nothing */ }
var parseData = require("./components/parseData.js")

module.exports = NodeHelper.create({
  start: function () {
    this.Gateway = {
      MMConfig: null, // real config file (config.js)
      EXT: null, // EXT plugins list
      EXTDescription: {}, // description of EXT
      EXTConfigured: [], // configured EXT in config
      EXTInstalled: [], // installed EXT in MM
      EXTStatus: {}, // status of EXT
      user: {
        _id: 1,
        username: 'admin',
        password: 'admin'
      },
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
      last_code: null,
      last_code_user: null,
      last_code_time: null,
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
        //log("Libraries:", this.lib)
        if (!this.lib.error) {
          this.lib.Gateway.initialize(this)
          if (this.config.CLIENT_ID) this.lib.SmartHome.initialize(this)
          else this.lib.SmartHome.disable(this)
          this.lib.Gateway.startServer(this)
        }
        break
      case "EXTStatus":
        if (this.Gateway.initialized && payload) {
          this.Gateway.EXTStatus = payload
          //log(this.Gateway.EXTStatus)
        }
        break
      case "Restart":
        if (this.Gateway.initialized) {
          setTimeout(() => this.lib.GWTools.restartMM(this) , 8000)
        }
        break
    }
  }
})
