var defaultConfig = {
  module: 'EXT-Librespot',
  disabled: false,
  config: {
    debug: false,
    email: "",
    password: "",
    deviceName: "MagicMirror",
    minVolume: 50,
    maxVolume: 100
  }
}

var schema = {
  "title": "EXT-Librespot",
  "description": "Properties for EXT-Librespot plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-Librespot"
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
        "email": {
          "type": "string",
          "title": "Your spotify email",
          "format": "email",
          "default": null
        },
        "password": {
          "type": "string",
          "title": "Your spotify password",
          "default": null
        },
        "deviceName": {
          "type": "string",
          "title": "Define THIS spotify device name",
          "default": "MagicMirror"
        },
        "minVolume": {
          "type": "number",
          "title": "Volume to set when assistant speaking (in %)",
          "default": 50,
          "minimum": 0,
          "maximum": 100
        },
        "maxVolume": {
          "type": "number",
          "title": "Max volume when spotify playing (in %)",
          "default": 100,
          "minimum": 1,
          "maximum": 100
        }
      },
      "required": ["email", "password", "deviceName"]
    }
  },
  "required": ["module", "config"]
}

exports.default = defaultConfig
exports.schema = schema
