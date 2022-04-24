var defaultConfig = {
  module: "EXT-UpdateNotification",
  position: "top_bar",
  configDeepMerge: true,
  disabled: false,
  config: {
    debug: false,
    updateInterval: 10 * 60 * 1000, // every 10 minutes
    startDelay: 60 * 1000, // delay before 1st scan
    ignoreModules: [],
    updateCommands: [],
    notification: {
      useTelegramBot: true,
      sendReady: true,
      useScreen: true,
      useCallback: true
    },
    update: {
      autoUpdate: true,
      autoRestart: true,
      usePM2: false,
      PM2Name: "0",
      defaultCommand: "git --reset hard && git pull && npm install",
      logToConsole: true,
      timeout: 2*60*1000
    }
  }
}

var schema = {

}

exports.default = defaultConfig
exports.schema = schema
