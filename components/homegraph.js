/** homegraph **/

var log = () => { /* do nothing */ }

function init(that) {
  if (that.config.debug) log = (...args) => { console.log("[GATEWAY] [SMARTHOME] [HOMEGRAPH]", ...args) }
  let file = that.lib.path.resolve(__dirname, "../credentials.json")
  if (that.lib.fs.existsSync(file)) {
    that.SmartHome.homegraph = that.lib.googleapis.google.homegraph({
      version: 'v1',
      auth: new that.lib.GoogleAuthLibrary.GoogleAuth({
        keyFile: file,
        scopes: ['https://www.googleapis.com/auth/homegraph']
      })
    })
  } else {
    console.error("[GATEWAY] [SMARTHOME] [HOMEGRAPH] credentials.json: file not found!")
    that.lib.callback.send(that, "Alert", "[HOMEGRAPH] Hey! credentials.json: file not found!")
  }
}

async function requestSync(that) {
  if (!that.SmartHome.homegraph) return
  log("[RequestSync] in Progress...")
  that.lib.callback.send(that, "Done", "Sync with Google Graph in Progress...")
  let body = {
    requestBody: {
      agentUserId: that.SmartHome.user.user,
      async: false
    }
  }
  try {
    const res = await that.SmartHome.homegraph.devices.requestSync(body)
    log("[RequestSync] Done.", res.statusText)
    that.lib.callback.send(that, "Done","Sync with Google Graph is now activated!")
  } catch (e) {
    if (e.code) {
      console.error("[GATEWAY] [SMARTHOME] [HOMEGRAPH] [RequestSync] Error:", e.code , e.errors)
      that.lib.callback.send(that, "Alert", "[requestSync] Error " + e.code + " - " + e.errors[0].message +" ("+ e.errors[0].reason +")")
    } else {
      console.error("[GATEWAY] [SMARTHOME] [HOMEGRAPH] [RequestSync]", e.toString()) 
      that.lib.callback.send(that, "Alert", "[requestSync] " + e.toString())
    }
  }
}

async function queryGraph(that) {
  if (!that.SmartHome.homegraph) return
  let query = {
    requestBody: {
      requestId: "Gateway-"+Date.now(),
      agentUserId: that.SmartHome.user.user,
      inputs: [
        {
          payload: {
            devices: [
              {
                id: "MMM-GoogleAssistant"
              }
            ]
          }
        }
      ]
    }
  }
  try { 
    const res = await that.SmartHome.homegraph.devices.query(query)
    log("[QueryGraph]", JSON.stringify(res.data))
  } catch (e) { 
    console.log("[GATEWAY] [SMARTHOME] [HOMEGRAPH] [QueryGraph]", e.code ? e.code : e, e.errors? e.errors : "")
  }
}

async function updateGraph(that) {
  if (!that.SmartHome.homegraph) return
  let EXT = that.SmartHome.EXT
  let current = that.SmartHome.smarthome
  let old = that.SmartHome.oldSmartHome

  if (!that.lib._.isEqual(current, old)) {
    let state = {
      online: true
    }
    if (EXT["EXT-Screen"]) {
      state.on = current.Screen
    }
    if (EXT["EXT-Volume"]) {
      state.currentVolume = current.Volume
      state.isMuted = current.VolumeIsMuted
    }
    if (EXT["EXT-FreeboxTV"] && current.TvIsPlaying) {
      state.currentInput = "EXT-FreeboxTV"
    } else if (EXT["EXT-SpotifyCanvasLyrics"] && current.Lyrics) {
      state.currentInput = "EXT-SpotifyCanvasLyrics"
    } else if (EXT["EXT-Pages"]) {
      state.currentInput = "page " + current.Page
    }
    if (EXT["EXT-Spotify"]) {
      state.currentApplication = current.SpotifyIsConnected ? "spotify" : "home"
    }
    let body = {
      requestBody: {
        agentUserId: that.SmartHome.user.user,
        requestId: "Gateway-"+Date.now(),
        payload: {
          devices: {
            states: {
              "MMM-GoogleAssistant": state
            }
          }
        }
      }
    }
    try {
      const res = await that.SmartHome.homegraph.devices.reportStateAndNotification(body)
      if (res.status != 200) log("[ReportState]", res.data, state, res.status, res.statusText)
    } catch (e) {
      console.error("[GATEWAY] [SMARTHOME] [HOMEGRAPH] [ReportState]", e.code ? e.code : e, e.errors? e.errors : "")
    }
  }
}
  
exports.init = init
exports.requestSync = requestSync
exports.queryGraph = queryGraph
exports.updateGraph = updateGraph
