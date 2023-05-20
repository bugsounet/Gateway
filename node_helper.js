"use strict"

var log = (...args) => { /* do nothing */ }
var parseData = require("./components/parseData.js")
var NodeHelper = require("node_helper")

module.exports = NodeHelper.create({
  start: function () {
    this.Gateway = {}
    this.SmartHome = {}
    this.lib = { error: 0 }
    parseData.init(this)
  },

  socketNotificationReceived: async function (noti, payload) {
    switch (noti) {
      case "INIT":
        if (this.alreadyInitialized) {
          console.error("[GATEWAY] You can't use Gateway in server mode")
          this.sendSocketNotification("ERROR", "You can't use Gateway in server mode")
          return
        } else console.log("[GATEWAY] Gateway Version:", require('./package.json').version, "rev:", require('./package.json').rev)
        if (this.Gateway.server) return
        this.config = payload
        if (this.config.debug) log = (...args) => { console.log("[GATEWAY]", ...args) }
        this.sendSocketNotification("MMConfig")
        break
      case "MMConfig":
        if (this.alreadyInitialized) return console.error("[GATEWAY] I say no! You can't use Gateway in server mode")
        this.alreadyInitialized= true
        await parseData.parse(this,payload)
        if (this.lib.error || this.Gateway.errorInit) return
        this.lib.Gateway.initialize(this)
        if (this.config.CLIENT_ID) this.lib.SmartHome.initialize(this)
        else this.lib.SmartHome.disable(this)
        this.lib.Gateway.startServer(this, cb => {
          if (cb) {
            console.log("[GATEWAY] Gateway Ready!")
            this.sendSocketNotification("INITIALIZED")
            this.lib.GWTools.setActiveVersion("Gateway", this)
          }
        })
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
      case "HELLO":
        if (!this.lib.GWTools) return console.error("[GATEWAY] internal error: lib GWTools not found!")
        this.lib.GWTools.setActiveVersion(payload, this)
    }
  }
})
