var defaultConfig = {
  module: 'EXT-ScreenManager',
  disabled: false,
  config: {
    debug: true,
    forceLock: true,
    ON: [
      "0 8 * * *"
    ],
    OFF: [
      "0 22 * * *"
    ]
  }
}

var schema = {
  "title": "EXT-ScreenManager",
  "description": "{PluginDescription}",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "{PluginName}",
      "default": "EXT-ScreenManager"
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
        "forceLock": {
          "type": "boolean",
          "title": "{EXT-ScreenManager_Lock}",
          "default": true
        },
        "ON": {
          "type": "array",
          "title": "{EXT-ScreenManager_On}",
          "default": ["0 8 * * *"],
          "minItems": 1,
          "item": {
            "type": "string"
          }
        },
        "OFF": {
          "type": "array",
          "title": "{EXT-ScreenManager_Off}",
          "default": ["0 22 * * *"],
          "minItems": 1,
          "item": {
            "type": "string"
          }
        }
      },
      "required": ["ON", "OFF"]
    }
  },
  "required": ["module", "config"]
}

exports.default = defaultConfig
exports.schema = schema
