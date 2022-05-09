var defaultConfig = {
  module: 'EXT-Internet',
  position: 'top_left',
  disabled: false,
  config: {
    debug: false,
    displayPing: true,
    delay: 30 * 1000,
    scan: "google.fr",
    command: "pm2 restart 0",
    showAlert: true,
    needRestart: false
  }
}

var schema = {
  "title": "EXT-Internet",
  "description": "Properties for EXT-Internet plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-Internet"
    },
    "position": {
      "type": "string",
      "title": "Plugin position",
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
        "displayPing": {
          "type": "boolean",
          "title": "Display the ping value on the screen",
          "default": true
        },
        "delay": {
          "type": "number",
          "title": "Set the interval for internet checking (in ms)",
          "default": 30000
        },
        "scan": {
          "type": "number",
          "title": "Set the interval for internet checking (in ms)",
          "default": 30000
        },
        "command": {
          "type": "string",
          "title": "Ping point name or address",
          "default": "google.fr"
        },
        "showAlert": {
          "type": "boolean",
          "title": "Show or not the Alert about internet connection lost (EXT-Alert needed)",
          "default": true
        },
        "needRestart": {
          "type": "boolean",
          "title": "Restart your MagicMirror app with your prefered command",
          "default": false
        }
      }
    }
  },
  "required": ["module", "position", "config"]
}

exports.default = defaultConfig
exports.schema = schema
