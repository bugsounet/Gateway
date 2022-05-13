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
          "title": "Sometimes, loading MagicMirror can be a real horse race... and the result of the first update check can be no value (ping timeout). To prevent this set a delay before starting first scan (default : 60 secs)",
          "default": 60000
        },
        "ignoreModules": {
          "type": "array",
          "title": "Array of ignored modules",
          "default": [],
          "item": {
            "type": "string"
          }
        },
        "updateCommands": {
          "type": "array",
          "title": "You can define individual update commands for each module with an array",
          "default": [],
          "item": {
            "type": "string"
          }
        },
        "notification": {
          "type": "object",
          "title": "How can this plugin can notify",
          "properties": {
            "useTelegram" : {
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
          "title": "Interval for update checking in ms. (default: 10 mins)"
        },
        "startDelay": {
          "title": "Sometimes, loading MagicMirror can be a real horse race... and the result of the first update check can be no value (ping timeout). To prevent this set a delay before starting first scan (default : 60 secs)"
        },
        "ignoreModules": {
          "title": "Array of ignored modules"
        },
        "updateCommands": {
          "title": "You can define individual update commands for each module with an array"
        },
        "notification": {
          "title": "How can this plugin can notify",
          "properties": {
            "useTelegram" : {
              "title": "Do you use MMM-TelegramBot?"
            },
            "sendReady": {
              "title": "Send a welcome and initialized confirmation on start"
            },
            "useScreen": {
              "title": "Display update on the screen?"
            },
            "useCallback": {
              "title": "Send any callback process to telegramBot?"
            }
          }
        },
        "update": {
          "title": "How can this plugin can update modules and plugin",
          "properties" : {
            "autoUpdate" : {
              "title": "If you want an automated update process, just activate it!"
            },
            "autoRestart": {
              "title": "Restart MagicMirror after update automatically."
            },
            "PM2Name": {
              "title": "Name or ID of the MagicMirror process in PM2"
            },
            "defaultCommand": {
              "title": "Define your default update command. It is being used if there is no individual command for the module in the updateCommands array."
            },
            "logToConsole": {
              "title": "This feature is needed for user who don't use PM2 ! Log process and result in console"
            },
            "timeout": {
              "title": "Maximum execution time of an update in ms (default: 2 mins)"
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
