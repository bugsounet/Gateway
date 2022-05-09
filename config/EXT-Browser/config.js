var defaultConfig = {
  module: "EXT-Browser",
  disabled: false,
  config: {
    debug: false,
    displayDelay: 60 * 1000,
    scrollActivate: false,
    scrollStep: 25,
    scrollInterval: 1000,
    scrollStart: 5000
  }
}

var schema = {
  "title": "EXT-Browser",
  "description": "Properties for EXT-Browser plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-Browser"
    },
    "disabled": {
      "type": "boolean",
      "title": "Disable the plugin",
      "default": false
    },
    "config": {
      "type": "object",
      "title": "Configuration",
      "properties": {
        "debug": {
          "type": "boolean",
          "title": "Enable debug mode",
          "default": false
        },
        "displayDelay": {
          "type": "number",
          "title": "Delay before closing the browser automaticaly in ms. If you want to disable this delay, set it to 0 (default is 60 secs)",
          "default": 60000
        },
        "scrollActivate": {
          "type": "boolean",
          "title": "Activate or not auto-scrolling",
          "default": false
        },
        "scrollStep": {
          "type": "number",
          "title": "Scrolling step in px for scrolling down",
          "default": 25
        },
        "scrollInterval": {
          "type": "number",
          "title": "Scrolling interval for next scrollStep",
          "default": 1000
        },
        "scrollStart": {
          "type": "number",
          "title": "Delay before scrolling down in ms (after url loaded )",
          "default": 5000
        }
      }
    }
  },
  "required": ["module"]
}

exports.default = defaultConfig
exports.schema = schema
