var defaultConfig = {
  module: 'EXT-GooglePhotos',
  position: 'top_left',
  disabled: false,
  config: {
    debug: false,
    displayType: 0,
    displayDelay: 10 * 1000,
    displayInfos: true,
    albums: [],
    sort: "new", // "old", "random"
    hiResolution: true,
    timeFormat: "DD/MM/YYYY HH:mm",
    moduleHeight: 300,
    moduleWidth: 300
  }
}

var schema = {

}

exports.default = defaultConfig
exports.schema = schema
