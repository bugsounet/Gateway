var defaultConfig = {
  module: "EXT-Detector",
  configDeepMerge: true,
  disabled: false,
  config: {
    debug: false,
    useIcon: true,
    touchOnly: false,
    detectors: [
      {
        detector: "Snowboy",
        Model: "jarvis",
        Sensitivity: null
      },
      {
        detector: "Porcupine",
        Model: "ok google",
        Sensitivity: null
      },
      {
        detector: "Porcupine",
        Model: "hey google",
        Sensitivity: null
      }
    ]
  }
}

var schema = {

}

exports.default = defaultConfig
exports.schema = schema
