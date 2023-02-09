/** parse data from MagicMirror **/
var _load = require("../components/loadLibraries.js")

async function parse(that,data) {
  let bugsounet = await _load.libraries(that)
  if (bugsounet) {
    console.error("[GATEWAY] Warning:", bugsounet, "needed library not loaded !")
    console.error("[GATEWAY] Try to solve it with `npm run rebuild` in Gateway directory")
    return
  }
  that.Gateway.MMConfig = await that.lib.GWTools.readConfig(that)
  if (!that.Gateway.MMConfig) return console.error("[GATEWAY] Error: MagicMirror config.js file not found!")
  that.Gateway.language = that.Gateway.MMConfig.language
  that.Gateway.webviewTag = that.lib.GWTools.checkElectronOptions(that.Gateway.MMConfig)
  that.Gateway.EXT = data.DB.sort()
  that.Gateway.EXTDescription = data.Description
  that.Gateway.translation = data.Translate
  that.Gateway.schemaTranslatation = data.Schema
  that.Gateway.EXTStatus = data.EXTStatus
  that.Gateway.GACheck.version = that.lib.GWTools.searchGA(that)
  that.Gateway.GAConfig = that.lib.GWTools.getGAConfig(that.Gateway.MMConfig)
  that.Gateway.freeteuse = await that.lib.GWTools.readFreeteuseTV(that)
  that.Gateway.radio= await that.lib.GWTools.readRadioRecipe(that)
}

exports.parse = parse
