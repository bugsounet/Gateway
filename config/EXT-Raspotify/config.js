var defaultConfig = {
  module: 'EXT-Raspotify',
  disabled: false,
  config: {
    debug: false,
    email: "",
    password: "",
    deviceName: "MagicMirror",
    deviceCard: "hw:CARD=Headphones,DEV=0",
    minVolume: 50,
    maxVolume: 100
  }
}

var schema = {
  "title": "EXT-Raspotify",
  "description": "{PluginDescription}",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "{PluginName}",
      "default": "EXT-Raspotify"
    },
    "disabled": {
      "type": "boolean",
      "title": "{PluginDisable}",
      "default": false
    },
    "config": {
      "type": "object",
      "title": "{PluginConfiguration}",
      "properties": {
        "debug": {
          "type": "boolean",
          "title": "{PluginDebug}",
          "default": false
        },
        "email": {
          "type": "string",
          "title": "{EXT-Librespot_Email}",
          "format": "email",
          "default": null
        },
        "password": {
          "type": "string",
          "title": "{EXT-Librespot_Password}",
          "default": null
        },
        "deviceName": {
          "type": "string",
          "title": "{EXT-Librespot_Name}",
          "default": "MagicMirror"
        },
        "deviceCard": {
          "type": "string",
          "title": "{EXT-Raspotify_Card}Define the playing device card (see wiki page)",
          "default": null
        },
        "minVolume": {
          "type": "number",
          "title": "{EXT-Librespot_Min}",
          "default": 50,
          "minimum": 0,
          "maximum": 100
        },
        "maxVolume": {
          "type": "number",
          "title": "{EXT-Librespot_Max}",
          "default": 100,
          "minimum": 1,
          "maximum": 100
        }
      },
      "required": ["email", "password", "deviceName", "deviceCard"]
    }
  },
  "required": ["module", "config"]
}

exports.default = defaultConfig
exports.schema = schema
