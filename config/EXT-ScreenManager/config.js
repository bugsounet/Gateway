var defaultConfig = {
  module: 'EXT-ScreenManager',
  disabled: false,
  config: {
    debug: true,
    forceLock: true,
    ON: [
      "0 8 * * *"
    ],
    OFF: [
      "0 22 * * *"
    ]
  }
}

var schema = {

}

exports.default = defaultConfig
exports.schema = schema
