"use strict"

var log = (...args) => { /* do nothing */ }
var parseData = require("./components/parseData.js")
var NodeHelper = require("node_helper")

module.exports = NodeHelper.create({
  start: function () {
    parseData.init(this)
  },

  socketNotificationReceived: async function (noti, payload) {
    switch (noti) {
      case "INIT":
        try {
          let testGA = require('../MMM-GoogleAssistant/package.json').version
          if (parseData.cmpVersions(testGA, "6.0.0") >= 0) {
            console.error("Gateway is not needed with MMM-GoogleAssistant v6")
            this.sendSocketNotification("ERROR", "Gateway is not needed with MMM-GoogleAssistant v6")
            return
          }
        } catch (e) {
          console.error("MMM-GoogleAssistant not found!")
          this.sendSocketNotification("ERROR", "MMM-GoogleAssistant not found!")
          return
        }

        if (this.alreadyInitialized) {
          console.error("[GATEWAY] You can't use Gateway in server mode")
          this.sendSocketNotification("ERROR", "You can't use Gateway in server mode")
          setTimeout(() => process.exit(), 5000)
          return
        } else console.log("[GATEWAY] Gateway Version:", require('./package.json').version, "rev:", require('./package.json').rev)
        if (this.Gateway.server) return
        this.config = payload
        if (this.config.debug) log = (...args) => { console.log("[GATEWAY]", ...args) }
        this.sendSocketNotification("MMConfig")
        break
      case "MMConfig":
        if (this.alreadyInitialized) {
		  console.error("[GATEWAY] You can't use Gateway in server mode")
		  setTimeout(() => process.exit(), 5000)
		  return
		}
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
        if (!this.lib.GWTools) {
          // library is not loaded ... retry
          setTimeout(() => { this.socketNotificationReceived("HELLO", payload) }, 1000)
          return
        }
        this.lib.GWTools.setActiveVersion(payload, this)
        break
      case "RESTART":
        this.lib.GWTools.restartMM(this)
        break
      case "CLOSE":
        this.lib.GWTools.doClose(this)
        break
      case "TB_SYSINFO":
        let result = await this.Gateway.systemInformation.lib.Get()
        result.sessionId = payload
        this.sendSocketNotification("TB_SYSINFO-RESULT", result)
        break
      case "GET-SYSINFO":
        this.sendSocketNotification("SYSINFO-RESULT", await this.Gateway.systemInformation.lib.Get())
        break
    }
  }
})
