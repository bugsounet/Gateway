var defaultConfig = {
  module: 'EXT-YouTubeVLC',
  disabled: false,
  config: {
    debug: false,
    useSearch: true,
    displayHeader: true,
    minVolume: 30,
    maxVolume: 100
  }
}

var schema = {
  "title": "EXT-YouTubeVLC",
  "description": "{PluginDescription}",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "{PluginName}",
      "default": "EXT-YouTubeVLC"
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
        "useSearch": {
          "type": "boolean",
          "title": "{EXT-YouTube_Search}",
          "default": true
        },
        "displayHeader": {
          "type": "boolean",
          "title": "{EXT-YouTube_Header}",
          "default": true
        },
        "minVolume": {
          "type": "number",
          "title": "{EXT-YouTubeVLC_Min}",
          "default": 30,
          "minimum": 0,
          "maximum": 100
        },
        "maxVolume": {
          "type": "number",
          "title": "{EXT-YouTubeVLC_Max}",
          "default": 100,
          "minimum": 1,
          "maximum": 100
        }
      }
    }
  },
  "required": ["module"]
}

exports.default = defaultConfig
exports.schema = schema
