var defaultConfig = {
  module: "EXT-YouTube",
  position: "top_center",
  disabled: false,
  config: {
    fullscreen: false,
    width: "30vw",
    height: "30vh",
    useSearch: true,
    alwaysDisplayed: true,
    displayHeader: true,
    username: null,
    token: null
  }
}

var schema = {
  "title": "EXT-YouTube",
  "description": "Properties for EXT-YouTube plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-YouTube"
    },
    "position": {
      "type": "string",
      "title": "Plugin position",
      "default": "top_center",
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
        "fullscreen": {
          "type": "boolean",
          "title": "Enable fullscreen video (default in windows)",
          "default": false
        },
        "width": {
          "type": "string",
          "title": "Width of the your YouTube window (can be a px value too)",
          "default": "30vw"
        },
        "height": {
          "type": "string",
          "title": "Height of the your YouTube window (can be a px value too)",
          "default": "30vh"
        },
        "useSearch": {
          "type": "boolean",
          "title": "activate YouTube search functionality",
          "default": true
        },
        "alwaysDisplayed": {
          "type": "boolean",
          "title": "Should the YouTube windows have to be always displayed when a video is not playing ?",
          "default": true
        },
        "displayHeader": {
          "type": "boolean",
          "title": "Display a few seconds in popup the title found of the video (needed EXT-Alert)",
          "default": true
        },
        "username": {
          "type": [ "string", "null" ],
          "title": "username of the @bugsounet's support forum",
          "default": null
        },
        "token": {
          "type": [ "string", "null" ],
          "title": "The token associated to your usernane (sended by @bugsounet)",
          "default": null
        }
      },
      "required": ["username", "token"]
    }
  },
  "required": ["module", "config"]
}

exports.default = defaultConfig
exports.schema = schema
