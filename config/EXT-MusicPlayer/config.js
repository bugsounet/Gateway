var defaultConfig = {
  module: 'EXT-MusicPlayer',
  position: 'top_left',
  disabled: false,
  config: {
    debug: false,
    useUSB: false,
    musicPath: "/home/pi/Music",
    checkSubDirectory: false,
    autoStart: false,
    minVolume: 30,
    maxVolume: 100
  }
}

var schema = {
  "title": "EXT-MusicPlayer",
  "description": "Properties for EXT-MusicPlayer plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-MusicPlayer"
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
        "useUSB": {
          "type": "boolean",
          "title": "If you prefer play file from an USB Key, set it to true",
          "default": false
        },
        "musicPath": {
          "type": "string",
          "title": "Music path for playing music from Local Files",
          "default": "/home/pi/Music"
        },
        "checkSubDirectory": {
          "type": "boolean",
          "title": "Should this module inspect sub directory for create music list ?",
          "default": false
        },
        "autoStart": {
          "type": "boolean",
          "title": "AutoStart USB key Music at boot of MagicMirror or when USB key is plugged in",
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
          "title": "Volume to set when music playing (in %)",
          "default": 100,
          "minimum": 1,
          "maximum": 100
        }
      }
    }
  },
  "required": ["module", "config", "position"]
}

var fr = {
  "description": "Propriété du plugin EXT-MusicPlayer",
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
        "useUSB": {
          "title": "Active La lecture/recherche de fichiers à partir d'une clé USB"
        },
        "musicPath": {
          "title": "Chemin de vos fichiers de vos fichiers locaux"
        },
        "checkSubDirectory": {
          "title": "Ce plugin doit-il inspecter le sous-répertoire pour créer une liste de musique ?"
        },
        "autoStart": {
          "title": "Démarrage automatique de la clé USB Musique au démarrage de MagicMirror ou lorsque la clé USB est branchée"
        },
        "minVolume": {
          "title": "Volume à régler lorsque l'assistant parle (en %)"
        },
        "maxVolume": {
          "title": "Volume à régler lors de la lecture de la musique (en %)"
        }
      }
    }
  }
}

exports.default = defaultConfig
exports.schema = schema
exports.fr = fr
