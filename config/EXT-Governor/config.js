var defaultConfig = {
  module: 'EXT-Governor',
  disabled: false,
  config: {
    debug: false,
    sleeping: "powersave",
    working: "ondemand"
  }
}

var schema = {

}

exports.default = defaultConfig
exports.schema = schema
