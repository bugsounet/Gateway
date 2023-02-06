"use strict"

var NodeHelper = require("node_helper")
var log = (...args) => { /* do nothing */ }
var middleware = require("./components/Middleware.js")
var parseData = require("./components/parseData.js")

module.exports = NodeHelper.create({
  start: function () {
    this.MMConfig= null // real config file (config.js)
    this.EXT= null // EXT plugins list
    this.EXTDescription = {} // description of EXT
    this.EXTConfigured = [] // configured EXT in config
    this.EXTInstalled= [] // installed EXT in MM
    this.EXTStatus = {}
    this.user = {
      _id: 1,
      username: 'admin',
      email: 'admin@bugsounet.fr',
      password: 'admin'
    }
    this.electronOptions = {
      electronOptions: {
        webPreferences: {
          webviewTag: true
        }
      }
    }
    this.initialized = false
    this.app = null
    this.server= null
    this.translation = null
    this.schemaTranslatation = null
    this.language = null
    this.webviewTag = false
    this.GACheck= { find: false, version: 0, configured: false }
    this.GAConfig= {}
    this.lib = {}
    this.HyperWatch = null
  },

  socketNotificationReceived: async function (noti, payload) {
    switch (noti) {
      case "INIT":
        console.log("[GATEWAY] Gateway Version:", require('./package.json').version, "rev:", require('./package.json').rev)
        if (this.server) return
        this.config = payload
        if (this.config.debug) log = (...args) => { console.log("[GATEWAY]", ...args) }
        this.sendSocketNotification("MMConfig")
        break
      case "MMConfig":
        await parseData.parse(this,payload)
        middleware.initialize(this)
        break
      case "EXTStatus":
        if (this.initialized && payload) {
          this.EXTStatus = payload
        }
        break
      case "Restart":
        setTimeout(() => this.lib.tools.restartMM(this.config) , 8000)
        break
    }
  }
})
