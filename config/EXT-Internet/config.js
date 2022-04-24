var defaultConfig = {
  module: 'EXT-Internet',
  position: 'top_left',
  disabled: false,
  config: {
    debug: false,
    displayPing: true,
    delay: 30 * 1000,
    scan: "google.fr",
    command: "pm2 restart 0",
    showAlert: true,
    needRestart: false
  }
}

var schema = {

}

exports.default = defaultConfig
exports.schema = schema
