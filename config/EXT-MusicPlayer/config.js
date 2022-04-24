var defaultConfig = {
  module: 'EXT-MusicPlayer',
  position: 'top_left',
  disabled: false,
  config: {
    debug: false,
    useUSB: false,
    musicPath: "/home/pi/Music",
    checkSubDirectory: false,
    autoStart: false,
    minVolume: 30,
    maxVolume: 100
  }
}

var schema = {

}

exports.default = defaultConfig
exports.schema = schema
