let log = (...args) => { /* do nothing */ }

class speedtest {
  constructor(lib, io, req, Gateway, debug) {
    this.lib= lib
    this.io = io
    this.req = req
    this.Gateway= Gateway
    if (debug) log = (...args) => { console.log("[GATEWAY] [SPEED]", ...args) }
    this.lib.moment.locale(this.Gateway.language)
  }

  init(client) {
    this.io.once('connection', (client) => {
      log("Connected:", this.req.user.username)
      client.on('disconnect', (err) => {
        log("Disconnected:", this.req.user.username, "[" + err + "]")
      })
      client.emit("HELLO")
      client.on("ST_Start", async args => {
        await this.start(client)
      })
    })
  }

  async start(client) {
    log("Check SpeedTest")
    var ST = new this.lib["speedtest-net"]({
        "serverId": null,
        "acceptLicense": true,
        "acceptGdpr": true,
        "progress": (data) => this.progress(data, client)
    }, this.lib)
    try {
      var Check = await ST.start()
    } catch (err) {
      console.error("[GATEWAY] [SPEED]", err.message)
    } finally {
      if (Check) {
        Check.timeLocale = this.lib.moment(Date.now()).format("lll")
        Check.download.bandwidth = this.oToMbps(Check.download.bandwidth)
        Check.upload.bandwidth = this.oToMbps(Check.upload.bandwidth)
        log("Result:", Check)
        this.Gateway.systemInformation.result.SpeedTest = Check
        client.emit("RESULT")
        log("Done")
      }
    }
  }

  progress(data, client) {
    switch (data.type) {
      case "download":
        client.emit("DOWNLOAD", this.oToMbps(data.download.bandwidth))
        log("Download:", this.oToMbps(data.download.bandwidth), "Mbps")
        break
      case "upload":
        client.emit("UPLOAD", this.oToMbps(data.upload.bandwidth))
        log("Upload:", this.oToMbps(data.upload.bandwidth), "Mbps")
        break
      case "ping":
        client.emit("PING", data.ping.latency)
        log("Ping:", data.ping.latency, "ms")
        break
    }
  }

  /** Convert octect to Mbps [Match with Speedtest web result] **/
  oToMbps(value) {
    if (!value) return 0
    return (value * 0.000008).toFixed(2)
  }
}

module.exports = speedtest
