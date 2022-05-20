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
          "type": "string",
          "title": "Ping point name or address",
          "default": "google.fr"
        },
        "command": {
          "type": "string",
          "title": "Command which will be executed after the internet connection is detected as lost",
          "default": "pm2 restart 0"
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

var fr = {
  "description": "Propriété du plugin EXT-Internet",
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
        "displayPing": {
          "title": "Afficher la valeur du ping à l'écran"
        },
        "delay": {
          "title": "Définir l'intervalle de vérification Internet (en ms)"
        },
        "scan": {
          "title": "Nom ou adresse du point de contrôle Ping"
        },
        "command": {
          "title": "Commande qui sera exécutée une fois la connexion Internet perdue"
        },
        "showAlert": {
          "title": "Afficher ou non l'alerte de perte de connexion Internet (EXT-Alert nécessaire)"
        },
        "needRestart": {
          "title": "Redémarrez votre application Magic Mirror avec votre commande préférée"
        }
      }
    }
  }
}

var nl = {
  "description": "Properties for EXT-Internet plugin",
  "properties": {
    "module": {
      "title": "Plugin name"
    },
    "position": {
      "title": "Plugin position"
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
        "displayPing": {
          "title": "Display the ping value on the screen"
        },
        "delay": {
          "title": "Set the interval for internet checking (in ms)"
        },
        "scan": {
          "title": "Ping point name or address"
        },
        "command": {
          "title": "Command which will be executed after the internet connection is detected as lost"
        },
        "showAlert": {
          "title": "Show or not the Alert about internet connection lost (EXT-Alert needed)"
        },
        "needRestart": {
          "title": "Restart your MagicMirror app with your prefered command"
        }
      }
    }
  }
}

exports.default = defaultConfig
exports.schema = schema
exports.fr = fr
exports.nl = nl
