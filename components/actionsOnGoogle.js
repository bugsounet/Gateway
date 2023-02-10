var log = (...args) => { /* do nothing */ }

function actions (that) {
  if (that.config.debug) log = (...args) => { console.log("[GATEWAY] [SMARTHOME] [ACTIONS]", ...args) }

  that.SmartHome.actions.onSync((body, headers) => {
    log("[SYNC] Request:", JSON.stringify(body))
    let user_id = that.lib.SHTools.check_token(that,headers)
    if (!user_id) {
      console.error("[GATEWAY] [SMARTHOME] [ACTIONS] [SYNC] Error: user_id not found!")
      return {} // maybe return error ??
    }
    var result = {}
    result["requestId"] = body["requestId"]
    result['payload'] = {"agentUserId": user_id, "devices": []}
    let user = that.lib.SHTools.get_userOnly(that,user_id)
    let device = that.lib.SHTools.get_device(user.devices[0], that.SmartHome.device)
    result['payload']['devices'].push(device)
    log("[SYNC] Send Result:", JSON.stringify(result))
    return result
  })

  that.SmartHome.actions.onExecute((body, headers) => {
    log("[EXECUTE] Request:", JSON.stringify(body))
    let user_id = that.lib.SHTools.check_token(that,headers)
    if (!user_id) {
      console.error("[SMARTHOME] [ACTIONS] [EXECUTE] Error: user_id not found!")
      return {} // maybe return error ??
    }
    var result = {}
    /*
    result['payload'] = {}
    result['payload']['commands'] = []
    let inputs = body["inputs"]
    let device_id = inputs[0].payload.commands[0].devices[0].id || null
    let command = inputs[0].payload.commands[0].execution[0].command || null
    let params = inputs[0].payload.commands[0].execution[0].hasOwnProperty("params") ? inputs[0].payload.commands[0].execution[0].params : null
    let action_result = this.dial.execute(this.SmartHome, command, params, this.callback)
    action_result['ids'] = [device_id]
    result['payload']['commands'].push(action_result)
    log("[EXECUTE] Send Result:", JSON.stringify(result))
    */
    return result
  })

  that.SmartHome.actions.onQuery((body, headers) => {
    log("[QUERY] Request:", JSON.stringify(body))
    let user_id = that.lib.SHTools.check_token(that,headers)
    if (!user_id) {
      console.error("[SMARTHOME] [ACTIONS] [QUERY] Error: user_id not found!")
      return {} // maybe return error ??
    }
    var result = {}
    /*
    result['payload'] = {}
    result['payload']['devices'] = {}
    let inputs = body["inputs"]
    let device_id = inputs[0].payload.devices[0].id || null
    log("[QUERY] device_id:", device_id)
    result['payload']['devices'][device_id] = this.dial.query(this.SmartHome, this.EXT)
    log("[QUERY] Send Result:", JSON.stringify(result))
    */
    return result
  })

  that.SmartHome.actions.onDisconnect((body, headers) => {
    log("[Disconnect]")
    that.lib.SHTools.delete_token(that, that.lib.SHTools.get_token(headers))
    return {}
  })
}

exports.actions = actions
