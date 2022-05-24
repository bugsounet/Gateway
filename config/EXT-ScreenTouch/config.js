var defaultConfig = {
  module: 'EXT-ScreenTouch',
  disabled: false,
  config: {
    mode: 3
  }
}

var schema = {
  "title": "EXT-ScreenTouch",
  "description": "{PluginDescription}",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "{PluginName}",
      "default": "EXT-ScreenTouch"
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
        "mode": {
          "type": "number",
          "title": "{EXT-ScreenTouch_Mode}",
          "default": 3,
          "enum": [ 1 , 2 , 3],
          "minimum": 1,
          "maximum": 3
        }
      },
      "required": ["mode"]
    }
  },
  "required": ["module", "config"]
}

exports.default = defaultConfig
exports.schema = schema
