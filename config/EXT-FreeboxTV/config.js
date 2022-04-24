var defaultConfig = {
  module: 'EXT-FreeboxTV',
  position: 'top_left',
  configDeepMerge: true,
  disabled: false,
  config: {
    debug: false,
    fullscreen: true,
    width: 384,
    height: 216,
    streams: "streamsConfig.json",
    volume : {
      start: 100,
      min: 30,
      useLast: true
    }
  }
}

var schema = {

}

exports.default = defaultConfig
exports.schema = schema
