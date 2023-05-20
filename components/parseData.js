/** parse data from MagicMirror **/
var _load = require("../components/loadLibraries.js")

async function init(that) {
  that.Gateway = {
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
    GACheck: { find: false, version: 0, configured: false, ready: false },
    GAConfig: {},
    HyperWatch: null,
    radio: null,
    freeteuse: {},
    systemInformation: {
      lib: null,
      result: {}
    },
    activeVersion: {},
    homeText: null,
    errorInit: false
  }
  that.SmartHome = {
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
}

async function parse(that,data) {
  let bugsounet = await _load.libraries(that)
  if (bugsounet) {
    console.error("[GATEWAY] Warning:", bugsounet, "needed library not loaded !")
    console.error("[GATEWAY] Try to solve it with `npm run rebuild` in Gateway directory")
    return
  }
  that.Gateway.MMConfig = await that.lib.GWTools.readConfig(that)
  if (!that.Gateway.MMConfig) {
    that.Gateway.errorInit = true
    console.error("[GATEWAY] Error: MagicMirror config.js file not found!")
    that.sendSocketNotification("ERROR", "MagicMirror config.js file not found!")
    return
  }
  if (await that.lib.GWTools.MMConfigAddress(that)) return
  that.Gateway.language = that.Gateway.MMConfig.language
  that.Gateway.webviewTag = that.lib.GWTools.checkElectronOptions(that.Gateway.MMConfig)
  that.Gateway.EXT = data.DB.sort()
  that.Gateway.EXTDescription = data.Description
  that.Gateway.translation = data.Translate
  that.Gateway.schemaTranslatation = data.Schema
  that.Gateway.EXTStatus = data.EXTStatus
  that.Gateway.GACheck.version = that.lib.GWTools.searchGA(that)
  that.Gateway.GAConfig = that.lib.GWTools.getGAConfig(that.Gateway.MMConfig)
  that.Gateway.homeText = await that.lib.GWTools.getHomeText(that.lib, that.Gateway.language)
  that.Gateway.freeteuse = await that.lib.GWTools.readFreeteuseTV(that)
  that.Gateway.radio= await that.lib.GWTools.readRadioRecipe(that)
  that.Gateway.systemInformation.lib = new that.lib.SystemInformation(that.lib, that.Gateway.translation)
  that.Gateway.systemInformation.result = await that.Gateway.systemInformation.lib.initData()
  if (that.config.CLIENT_ID) {
    that.SmartHome.lang = that.lib.SHTools.SHLanguage(that.Gateway.language)
    that.SmartHome.use = true
    that.SmartHome.user.user = that.config.username
    that.SmartHome.user.password = that.config.password
    that.lib.homegraph.init(that)
    that.lib.Device.create(that)
  } else {
    console.log("[GATEWAY] no CLIENT_ID found in your config!")
    console.warn("[GATEWAY] SmartHome functionality is disabled")
  }
}

exports.init = init
exports.parse = parse
