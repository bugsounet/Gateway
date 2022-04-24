var defaultConfig = {
  module: 'EXT-Screen',
  position: 'top_left',
  disabled: false,
  config: {
    debug: false,
    animateBody: true,
    delay: 2 * 60 * 1000,
    turnOffDisplay: true,
    mode: 1,
    ecoMode: true,
    displayCounter: true,
    displayBar: true,
    displayStyle: "Text",
    displayLastPresence: true,
    lastPresenceTimeFormat: "LL H:mm",
    detectorSleeping: false,
    autoHide: true,
    delayed: 0,
    gpio: 20,
    clearGpioValue: true
  }
}

var schema = {

}

exports.default = defaultConfig
exports.schema = schema
