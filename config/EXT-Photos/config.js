var defaultConfig = {
  module: "EXT-Photos",
  disabled: false,
  config: {
    debug: false,
    displayDelay: 20 * 1000,
    loop: false
  }
}

var schema = {
  "title": "EXT-Photos",
  "description": "Properties for EXT-Photos plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-Photos"
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
        "displayDelay": {
          "type": "number",
          "title": "Delay before change photo automaticaly in ms. (default is 20 secs)",
          "default": 20000,
          "minimum": 0,
          "maximum": 60000
        },
        "loop": {
          "type": "boolean",
          "title": "Make a loop on all photos",
          "default": false
        }
      }
    }
  },
  "required": ["module", "config"]
}

var fr = {
  "description": "Propriété du plugin EXT-Photos",
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
        "displayDelay": {
          "title": "Délai avant changement automatique de photo en ms. (la valeur par défaut est de 20 secondes)"
        },
        "loop": {
          "title": "Faire une boucle sur toutes les photos"
        }
      }
    }
  }
}

exports.default = defaultConfig
exports.schema = schema
exports.fr = fr
