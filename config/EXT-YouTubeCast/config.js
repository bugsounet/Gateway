var defaultConfig = {
  module: "EXT-YouTubeCast",
  position: "top_center",
  disabled: false,
  config: {
    debug: false,
    fullscreen: false,
    width: "30vw",
    height: "17vw",
    alwaysDisplayed: true,
    castName: "MagicMirror",
    port: 8569
  }
}

var schema = {
  "title": "EXT-YouTubeCast",
  "description": "Properties for EXT-YouTubeCast plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-YouTubeCast"
    },
    "position": {
      "type": "string",
      "title": "Plugin position",
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
        "alwaysDisplayed": {
          "type": "boolean",
          "title": "Should the YouTube windows have to be always displayed when a video is not playing ?",
          "default": true
        },
        "castName": {
          "type": "string",
          "title": "Name of the MagicMirror cast device",
          "default": "MagicMirror"
        },
        "port": {
          "type": "number",
          "title": "Port of the MagicMirror cast device",
          "default": 8569
        }
      },
      "required": ["castName", "port"]
    }
  },
  "required": ["module", "config", "position"]
}

var fr = {
  "description": "Propriété pour le plugin EXT-YouTubeCast",
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
        "alwaysDisplayed": {
          "title": "La fenêtre YouTube doivent-elles toujours être affichée lorsqu'une vidéo n'est pas en cours de lecture ?"
        },
        "castName": {
          "title": "Nom de l'appareil MagicMirror cast"
        },
        "port": {
          "title": "Port de diffusion sur MagicMirror"
        }
      }
    }
  }
}

var nl = {
  "description": "Properties for EXT-YouTubeCast plugin",
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
        "fullscreen": {
          "title": "Enable fullscreen video (default in windows)"
        },
        "width": {
          "title": "Width of the your YouTube window (can be a px value too)"
        },
        "height": {
          "title": "Height of the your YouTube window (can be a px value too)"
        },
        "alwaysDisplayed": {
          "title": "Should the YouTube windows have to be always displayed when a video is not playing ?"
        },
        "castName": {
          "title": "Name of the MagicMirror cast device"
        },
        "port": {
          "title": "Port of the MagicMirror cast device"
        }
      }
    }
  }
}

exports.default = defaultConfig
exports.schema = schema
exports.fr = fr
exports.nl = nl
