var defaultConfig = {
  module: 'EXT-ScreenTouch',
  disabled: false,
  config: {
    mode: 3
  }
}

var schema = {
  "title": "EXT-ScreenTouch",
  "description": "Properties for EXT-ScreenTouch plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-ScreenTouch"
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
        "mode": {
          "type": "number",
          "title": "Selected mode for enable/disable the screen with touch",
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
