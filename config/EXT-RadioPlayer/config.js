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
  "description": "Properties for EXT-RadioPlayer plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-RadioPlayer"
    },
    "position": {
      "type": "string",
      "title": "Plugin position",
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
        "minVolume": {
          "type": "number",
          "title": "Volume to set when assistant speaking (in %)",
          "default": 30,
          "minimum": 0,
          "maximum": 100
        },
        "maxVolume": {
          "type": "number",
          "title": "Volume to set when radio playing (in %)",
          "default": 75,
          "minimum": 1,
          "maximum": 100
        }
      }
    }
  },
  "required": ["module", "config", "position"]
}

var fr = {
  "description": "Propriété du plugin EXT-RadioPlayer",
  "properties": {
    "module": {
      "title": "Nom du Plugin"
    },
    "position": {
      "title": "Position du plugin"
    },
    "disabled": {
      "title": "Désactive le plugin"
    },
    "config": {
      "title": "Configuration",
      "properties": {
        "debug": {
          "title": "Active le mode debug"
        },
        "minVolume": {
          "title": "Volume à régler lorsque l'assistant parle (en %)"
        },
        "maxVolume": {
          "title": "Volume à régler lors de l'écoute de la radio (en %)"
        }
      }
    }
  }
}

exports.default = defaultConfig
exports.schema = schema
exports.fr = fr
