var defaultConfig = {
  module: 'EXT-Spotify',
  position: 'top_left',
  disabled: false,
  config: {
    updateInterval: 1000,
    idleInterval: 10000,
    useBottomBar: false,
    CLIENT_ID: "",
    CLIENT_SECRET: ""
  }
}

var schema = {
  "title": "EXT-Spotify",
  "description": "{PluginDescription}",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "{PluginName}",
      "default": "EXT-Spotify"
    },
    "position": {
      "type": "string",
      "title": "{PluginPosition}",
      "default": "top_left",
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
        "updateInterval": {
          "type": "number",
          "title": "{EXT-Spotify_Interval}",
          "default": 1000
        },
        "idleInterval": {
          "type": "number",
          "title": "{EXT-Spotify_Idle}",
          "default": 10000
        },
        "useBottomBar": {
          "type": "boolean",
          "title": "{EXT-Spotify_BottomBar}",
          "default": false
        },
        "CLIENT_ID": {
          "type": "string",
          "title": "{EXT-Spotify_ID}",
          "default": null
        },
        "CLIENT_SECRET": {
          "type": "string",
          "title": "{EXT-Spotify_Secret}",
          "default": null
        },
      },
      "required": ["CLIENT_ID", "CLIENT_SECRET"]
    }
  },
  "required": ["module", "config", "position"]
}

exports.default = defaultConfig
exports.schema = schema
