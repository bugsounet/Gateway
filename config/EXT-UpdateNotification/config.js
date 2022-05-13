var defaultConfig = {
  module: "EXT-UpdateNotification",
  position: "top_bar",
  configDeepMerge: true,
  disabled: false,
  config: {
    debug: false,
    updateInterval: 10 * 60 * 1000, // every 10 minutes
    startDelay: 60 * 1000, // delay before 1st scan
    ignoreModules: [],
    updateCommands: [],
    notification: {
      useTelegramBot: true,
      sendReady: true,
      useScreen: true,
      useCallback: true
    },
    update: {
      autoUpdate: true,
      autoRestart: true,
      usePM2: false,
      PM2Name: "0",
      defaultCommand: "git --reset hard && git pull && npm install",
      logToConsole: true,
      timeout: 2*60*1000
    }
  }
}

var schema = {
  "title": "EXT-UpdateNotification",
  "description": "Properties for EXT-UpdateNotification plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-UpdateNotification"
    },
    "position": {
      "type": "string",
      "title": "Plugin position",
      "default": "top_bar",
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
    "configDeepMerge": {
      "type": "boolean",
      "title": "Automatically merge with the default configuration if a feature is missing in the configuration",
      "default": true
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
        "updateInterval": {
          "type": "number",
          "title": "Interval for update checking in ms. (default: 10 mins)",
          "default": 600000
        },
        "startDelay": {
          "type": "number",
          "title": "Delay before starting first scan (default : 60 secs)",
          "default": 60000
        },
        "ignoreModules": {
          "type": "array",
          "title": "Array of ignored modules names",
          "default": [],
          "item": {
            "type": "string"
          }
        },
        "updateCommands": {
          "type": "array",
          "title": "Update commands for each module with an array of module/command object",
          "default": [],
          "minItems": 0,
          "items": {
            "properties": {
              "module" : {
                "type": "string",
                "title": "Name of the module."
              },
              "command": {
                "type": "string",
                "title": "Update command for this module"
              }
            },
            "minProperties": 2,
            "maxProperties": 2,
            "additionalProperties": false
          },
          "additionalItems": {
            "properties": {
              "module" : {
                "type": "string"
              },
              "command": {
                "type": "string"
              }
            }
          }
        },
        "notification": {
          "type": "object",
          "title": "How can this plugin can notify",
          "properties": {
            "useTelegramBot" : {
              "type": "boolean",
              "title": "Do you use MMM-TelegramBot?",
              "default": true
            },
            "sendReady": {
              "type": "boolean",
              "title": "Send a welcome and initialized confirmation on start",
              "default": true
            },
            "useScreen": {
              "type": "boolean",
              "title": "Display update on the screen?",
              "default": true
            },
            "useCallback": {
              "type": "boolean",
              "title": "Send any callback process to telegramBot?",
              "default": true
            }
          }
        },
        "update": {
          "type": "object",
          "title": "How can this plugin can update modules and plugin",
          "properties" : {
            "autoUpdate" : {
              "type": "boolean",
              "title": "If you want an automated update process, just activate it!",
              "default": true
            },
            "autoRestart": {
              "type": "boolean",
              "title": "Restart MagicMirror after update automatically.",
              "default": true
            },
            "PM2Name": {
              "type": ["string", "number"],
              "title": "Name or ID of the MagicMirror process in PM2",
              "default": 0
            },
            "defaultCommand": {
              "type": "string",
              "title": "Define your default update command. It is being used if there is no individual command for the module in the updateCommands array.",
              "default": "git reset --hard && git pull && npm install"
            },
            "logToConsole": {
              "type": "boolean",
              "title": "This feature is needed for user who don't use PM2 ! Log process and result in console",
              "default": true
            },
            "timeout": {
              "type": "number",
              "title": "Maximum execution time of an update in ms (default: 2 mins)",
              "default": 120000
            }
          }
        }
      }
    }
  },
  "required": ["module", "config", "position", "configDeepMerge"]
}

var fr = {
  "description": "Propriété du plugin EXT-UpdateNotification",
  "properties": {
    "module": {
      "title": "Nom du Plugin"
    },
    "position": {
      "title": "Position du plugin"
    },
    "configDeepMerge": {
      "title": "Fusionner automatiquement avec la configuration par défaut si une fonctionnalitée manque dans la configuration"
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
        "updateInterval": {
          "title": "Intervalle de vérification des mises à jour en ms. (par défaut: 10 minutes)"
        },
        "startDelay": {
          "title": "Délai avant le début de la premiere recherche de mise à jour (par défaut: 60 secondes)"
        },
        "ignoreModules": {
          "title": "Tableau de modules ignorés"
        },
        "updateCommands": {
          "title": "Mise à jour automatique avec des commandes défini pour chaque module dans un tableau d'objet module/command",
          "items": {
            "properties": {
              "module" : {
                "title": "Nom du module"
              },
              "command": {
                "title": "Commande de mise à jour pour ce module"
              }
            }
          }
        },
        "notification": {
          "title": "Comment ce plugin peut-il notifier ?",
          "properties": {
            "useTelegramBot" : {
              "title": "Utilisez-vous MMM-TelegramBot ?"
            },
            "sendReady": {
              "title": "Envoyer un message de bienvenue et une confirmation d'initialisation au démarrage"
            },
            "useScreen": {
              "title": "Afficher la mise à jour à l'écran ?"
            },
            "useCallback": {
              "title": "Envoyer le resultat de la mise à jour sur MMM-TelegramBot ?"
            }
          }
        },
        "update": {
          "title": "Paramètres de mise à jour",
          "properties" : {
            "autoUpdate" : {
              "title": "Activation de la mise à jour automatique"
            },
            "autoRestart": {
              "title": "Redémarrer automatiquement MagicMirror après la mise à jour."
            },
            "PM2Name": {
              "title": "Nom ou ID du processus MagicMirror dans PM2"
            },
            "defaultCommand": {
              "title": "Définissez votre commande de mise à jour par défaut. Elle sera utilisé s'il n'y a pas de commande individuelle pour le module dans le tableau updateCommands."
            },
            "logToConsole": {
              "title": "Journaliser le processus de mise à jour et le résultat dans la console"
            },
            "timeout": {
              "title": "Temps d'exécution maximal d'une mise à jour en ms (par défaut : 2 min)"
            }
          }
        }
      }
    }
  }
}

exports.default = defaultConfig
exports.schema = schema
exports.fr = fr
