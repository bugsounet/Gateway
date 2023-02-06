/** parse data from MagicMirror **/
var _load = require("../components/loadSensibleLibrary.js")

async function parse(that,data) {
  let bugsounet = await _load.library(that)
  if (bugsounet) {
    console.error("[GATEWAY] Warning:", bugsounet, "needed library not loaded !")
    console.error("[GATEWAY] Try to solve it with `npm run rebuild` in Gateway directory")
    return
  }
  that.MMConfig = await that.lib.tools.readConfig()
  if (!that.MMConfig) return console.error("[GATEWAY] Error: MagicMirror config.js file not found!")
  that.language = that.MMConfig.language
  that.webviewTag = that.lib.tools.checkElectronOptions(that.MMConfig)
  that.EXT = data.DB.sort()
  that.EXTDescription = data.Description
  that.translation = data.Translate
  that.schemaTranslatation = data.Schema
  that.EXTStatus = data.EXTStatus
  that.GACheck.version = that.lib.tools.searchGA()
  that.GAConfig = that.lib.tools.getGAConfig(that.MMConfig)
  that.freeteuse = await that.lib.tools.readFreeteuseTV()
  that.radio= await that.lib.tools.readRadioRecipe(that.language)
}

exports.parse = parse
