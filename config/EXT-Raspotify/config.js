var defaultConfig = {
  module: 'EXT-Raspotify',
  disabled: false,
  config: {
    debug: false,
    email: "",
    password: "",
    deviceName: "MagicMirror",
    deviceCard: "hw:CARD=Headphones,DEV=0",
    minVolume: 50,
    maxVolume: 100
  }
}

var schema = {

}

exports.default = defaultConfig
exports.schema = schema
