var defaultConfig = {
  module: 'EXT-YouTubeVLC',
  disabled: false,
  config: {
    debug: false,
    useSearch: true,
    displayHeader: true,
    minVolume: 30,
    maxVolume: 100
  }
}

var schema = {
  "title": "EXT-YouTubeVLC",
  "description": "Properties for EXT-YouTubeVLC plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-YouTubeVLC"
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
        "useSearch": {
          "type": "boolean",
          "title": "activate YouTube search functionality",
          "default": true
        },
        "displayHeader": {
          "type": "boolean",
          "title": "display a few seconds in popup the title found of the video (needed EXT-Alert)",
          "default": true
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
          "title": "Max volume when YouTube playing (in %)",
          "default": 100,
          "minimum": 1,
          "maximum": 100
        }
      }
    }
  },
  "required": ["module"]
}

var fr = {
  "description": "Propriété pour le plugin EXT-YouTubeVLC",
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
        "debug": {
          "title": "Activer le mode debug"
        },
        "useSearch": {
          "title": "Activer la fonctionnalité de recherche YouTube"
        },
        "displayHeader": {
          "title": "Afficher quelques secondes (en popup) le titre trouvé de la vidéo (nécessite EXT-Alert)"
        },
        "minVolume": {
          "title": "Volume à régler lorsque l'assistant parle (en %)"
        },
        "maxVolume": {
          "title": "Volume max lors de la lecture de YouTube (en %)"
        }
      }
    }
  }
}

exports.default = defaultConfig
exports.schema = schema
exports.fr = fr
