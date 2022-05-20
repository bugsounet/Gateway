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
          "title": "Selected mode for enable/disable the screen with touch (see wiki)",
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

var fr = {
  "description": "Propriété pour le plugin EXT-ScreenTouch",
  "properties": {
    "module": {
      "title": "Nom du plugin"
    },
    "disabled": {
      "title": "Désactiver le plugin"
    },
    "config": {
      "title": "Configuration",
      "properties": {
        "mode": {
          "title": "Numéro du mode pour activer/désactiver l'écran avec l'interface tactile (see wiki)"
        }
      }
    }
  }
}

var nl = {
  "description": "Properties for EXT-ScreenTouch plugin",
  "properties": {
    "module": {
      "title": "Plugin name"
    },
    "disabled": {
      "title": "Disable the plugin"
    },
    "config": {
      "title": "Configuration",
      "properties": {
        "mode": {
          "title": "Selected mode for enable/disable the screen with touch (see wiki)"
        }
      }
    }
  }
}

exports.default = defaultConfig
exports.schema = schema
exports.fr = fr
exports.nl = nl
