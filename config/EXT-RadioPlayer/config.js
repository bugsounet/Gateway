var defaultConfig = {
  module: 'EXT-RadioPlayer',
  position: 'top_right',
  disabled: false,
  config: {
    debug: false,
    minVolume: 30,
    maxVolume: 75,
  }
}

var schema = {
  "title": "EXT-RadioPlayer",
  "description": "{PluginDescription}",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "{PluginName}",
      "default": "EXT-RadioPlayer"
    },
    "position": {
      "type": "string",
      "title": "{PluginPosition}",
      "default": "top_right",
      "enum": [
        "top_bar",
        "top_left",
        "top_center",
        "top_right",
        "upper_third",
        "middle_center",
        "lower_third",
        "bottom_left",
        "bottom_center",
        "bottom_right",
        "bottom_bar",
        "fullscreen_above",
        "fullscreen_below"
      ]
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
        "minVolume": {
          "type": "number",
          "title": "{EXT-RadioPlayer_Min}",
          "default": 30,
          "minimum": 0,
          "maximum": 100
        },
        "maxVolume": {
          "type": "number",
          "title": "{EXT-RadioPlayer_Max}",
          "default": 75,
          "minimum": 1,
          "maximum": 100
        }
      }
    }
  },
  "required": ["module", "config", "position"]
}

exports.default = defaultConfig
exports.schema = schema
