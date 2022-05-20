var defaultConfig = {
  module: "EXT-Alert",
  disabled: false,
  config: {
    debug: false,
    ignore: []
  }
}

var schema = {
  "title": "EXT-Alert",
  "description": "Properties for EXT-Alert plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-Alert"
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
        "ignore": {
          "type": "array",
          "title": "Plugin list to ignore notifications",
          "default": []
        }
      }
    }
  },
  "required": ["module"]
}

var fr = {
  "description": "Propriété pour le plugin EXT-Alert",
  "properties": {
    "module": {
      "title": "Nom du plugin"
    },
    "disabled": {
      "title": "Désactiver le plugin"
    },
    "config": {
      "title": "Configuration"
      "properties": {
        "debug": {
          "title": "Activer le mode debug"
        },
        "ignore": {
          "title": "Liste les plugins/modules à ignorer pour ne pas afficher leurs notifications"
        }
      }
    }
  }
}

var nl = {
  "description": "Properties for EXT-Alert plugin",
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
        "debug": {
          "title": "Enable debug mode"
        },
        "ignore": {
          "title": "Plugin list to ignore notifications"
        }
      }
    }
  }
}

exports.default = defaultConfig
exports.schema = schema
exports.fr = fr
exports.nl = nl
