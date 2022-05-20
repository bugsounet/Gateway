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
  "description": "Properties for EXT-ScreenManager plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-ScreenManager"
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
        "forceLock": {
          "type": "boolean",
          "title": "Force to lock the screen counter and disable it",
          "default": true
        },
        "ON": {
          "type": "array",
          "title": "Defined cron ON time",
          "default": ["0 8 * * *"],
          "minItems": 1,
          "item": {
            "type": "string"
          }
        },
        "OFF": {
          "type": "array",
          "title": "Defined cron OFF time",
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

var fr = {
  "description": "Propriété pour le plugin EXT-ScreenManager",
  "properties": {
    "module": {
      "title": "Nom du Plugin"
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
        "forceLock": {
          "title": "Forcer à verrouiller le compteur d'écran et à le désactiver"
        },
        "ON": {
          "title": "Défini le temps d'alumage de l'écran via la tache cron"
        },
        "OFF": {
          "title": "Défini le temps d'extinction de l'écran via la tache cron"
        }
      }
    }
  }
}

var nl = {
  "description": "Properties for EXT-ScreenManager plugin",
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
        "forceLock": {
          "title": "Force to lock the screen counter and disable it"
        },
        "ON": {
          "title": "Defined cron ON time"
        },
        "OFF": {
          "title": "Defined cron OFF time"
        }
      }
    }
  }
}

exports.default = defaultConfig
exports.schema = schema
exports.fr = fr
exports.nl = nl
