/** parse data from MagicMirror **/
var _load = require("../components/loadSensibleLibrary.js")

async function parse(that,data) {
  let bugsounet = await _load.library(that)
  if (bugsounet) {
    console.error("[GATEWAY] Warning:", bugsounet, "needed library not loaded !")
    console.error("[GATEWAY] Try to solve it with `npm run rebuild` in Gateway directory")
    return
  }
  that.Gateway.MMConfig = await that.lib.tools.readConfig()
  if (!that.Gateway.MMConfig) return console.error("[GATEWAY] Error: MagicMirror config.js file not found!")
  that.Gateway.language = that.Gateway.MMConfig.language
  that.Gateway.webviewTag = that.lib.tools.checkElectronOptions(that.Gateway.MMConfig)
  that.Gateway.EXT = data.DB.sort()
  that.Gateway.EXTDescription = data.Description
  that.Gateway.translation = data.Translate
  that.Gateway.schemaTranslatation = data.Schema
  that.Gateway.EXTStatus = data.EXTStatus
  that.Gateway.GACheck.version = that.lib.tools.searchGA()
  that.Gateway.GAConfig = that.lib.tools.getGAConfig(that.Gateway.MMConfig)
  that.Gateway.freeteuse = await that.lib.tools.readFreeteuseTV()
  that.Gateway.radio= await that.lib.tools.readRadioRecipe(that.Gateway.language)
}

exports.parse = parse
