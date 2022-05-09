var defaultConfig = {
  module: "EXT-Alert",
  disabled: false,
  config: {
    debug: false,
    ignore: []
  }
}

var schema = {
  "title": "EXT-Alert",
  "description": "Properties for EXT-Alert plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-Alert"
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
        "ignore": {
          "type": "array",
          "title": "Plugin list to ignore notifications",
          "default": []
        },
      }
    }
  },
  "required": ["module"]
}

exports.default = defaultConfig
exports.schema = schema
