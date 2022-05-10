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
  "description": "Properties for EXT-YouTubeVLC plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-YouTubeVLC"
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
        "useSearch": {
          "type": "boolean",
          "title": "activate YouTube search functionality",
          "default": true
        },
        "displayHeader": {
          "type": "boolean",
          "title": "display a few seconds in popup the title found of the video (needed EXT-Alert)",
          "default": true
        },
        "minVolume": {
          "type": "number",
          "title": "Volume to set when assistant speaking (in %)",
          "default": 30,
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
      }
    }
  },
  "required": ["module"]
}

exports.default = defaultConfig
exports.schema = schema
