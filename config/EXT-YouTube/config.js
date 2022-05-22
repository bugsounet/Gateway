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
  "description": "{PluginDescription}",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "{PluginName}",
      "default": "EXT-YouTube"
    },
    "position": {
      "type": "string",
      "title": "{PluginPosition}",
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
      "title": "{PluginDisable}",
      "default": false
    },
    "config": {
      "type": "object",
      "title": "{PluginConfiguration}",
      "properties": {
        "debug": {
          "type": "boolean",
          "title": "{PluginDebug}",
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
  "required": ["module", "config", "position"]
}

/*
var fr = {
  "description": "Propriété pour le plugin EXT-YouTube",
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
        "fullscreen": {
          "title": "Activer la vidéo en plein écran (par défaut dans une fenêtre)"
        },
        "width": {
          "title": "Largeur de la fenêtre de votre YouTube (peut également être une valeur px)"
        },
        "height": {
          "title": "Hauteur de votre fenêtre YouTube (peut également être une valeur px)"
        },
        "useSearch": {
          "title": "Activer la fonctionnalité de recherche YouTube"
        },
        "alwaysDisplayed": {
          "title": "La fenêtre YouTube doivent-elles toujours être affichée lorsqu'une vidéo n'est pas en cours de lecture ?"
        },
        "displayHeader": {
          "title": "Afficher quelques secondes (en popup) le titre trouvé de la vidéo (nécessite EXT-Alert)"
        },
        "username": {
          "title": "Nom d'utilisateur du forum de support"
        },
        "token": {
          "title": "Le jeton associé à votre nom d'utilisateur (envoyé par @bugsounet)"
        }
      }
    }
  }
}

*/

exports.default = defaultConfig
exports.schema = schema
