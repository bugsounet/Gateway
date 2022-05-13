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
  "description": "Properties for EXT-Spotify plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-Spotify"
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
        "updateInterval": {
          "type": "number",
          "title": "Update interval when playing (refresh) in ms",
          "default": 1000
        },
        "idleInterval": {
          "type": "number",
          "title": "Update interval when idle (check if Spotify active) in ms",
          "default": 10000
        },
        "useBottomBar": {
          "type": "boolean",
          "title": "Activate visual of the current playback in the bottom bar",
          "default": false
        },
        "CLIENT_ID": {
          "type": "string",
          "title": "Client ID of your Spotify account",
          "default": null
        },
        "CLIENT_SECRET": {
          "type": "string",
          "title": "Client Secret of your Spotify account",
          "default": null
        },
      },
      "required": ["CLIENT_ID", "CLIENT_SECRET"]
    }
  },
  "required": ["module", "config", "position"]
}

var fr = {
  "description": "Propriété pour le plugin EXT-Spotify",
  "properties": {
    "module": {
      "title": "Nom du plugin"
    },
    "position": {
      "title": "Position du plugin"
    },
    "disabled": {
      "title": "Désactiver le plugin"
    },
    "config": {
      "title": "Configuration",
      "properties": {
        "debug": {
          "title": "Activer le mode debug"
        },
        "updateInterval": {
          "title": "Intervalle de mise à jour lors de la lecture (rafraîchissement) en ms"
        },
        "idleInterval": {
          "title": "Intervalle de mise à jour en cas d'inactivité (vérification si Spotify est utilisé) en ms"
        },
        "useBottomBar": {
          "title": "Activer le visuel de la lecture en cours dans la barre inférieure"
        },
        "CLIENT_ID": {
          "title": "ID client de votre compte Spotify"
        },
        "CLIENT_SECRET": {
          "title": "Clé secrète client de votre compte Spotify"
        }
      }
    }
  }
}

exports.default = defaultConfig
exports.schema = schema
exports.fr = fr
