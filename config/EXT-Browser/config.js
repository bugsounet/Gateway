var defaultConfig = {
  module: "EXT-Browser",
  disabled: false,
  config: {
    debug: false,
    displayDelay: 60 * 1000,
    scrollActivate: false,
    scrollStep: 25,
    scrollInterval: 1000,
    scrollStart: 5000
  }
}

var schema = {
  "title": "EXT-Browser",
  "description": "Properties for EXT-Browser plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-Browser"
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
          "title": "Delay before closing the browser automaticaly in ms. If you want to disable this delay, set it to 0 (default is 60 secs)",
          "default": 60000
        },
        "scrollActivate": {
          "type": "boolean",
          "title": "Activate or not auto-scrolling",
          "default": false
        },
        "scrollStep": {
          "type": "number",
          "title": "Scrolling step in px for scrolling down",
          "default": 25
        },
        "scrollInterval": {
          "type": "number",
          "title": "Scrolling interval for next scrollStep",
          "default": 1000
        },
        "scrollStart": {
          "type": "number",
          "title": "Delay before scrolling down in ms (after url loaded )",
          "default": 5000
        }
      }
    }
  },
  "required": ["module"]
}

var fr = {
  "description": "Propriété pour le plugin EXT-Browser",
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
        "displayDelay": {
          "title": "Délai avant la fermeture automatique du navigateur en ms. Si vous souhaitez désactiver ce délai, réglez-le sur 0 (par défaut: 60 secs)"
        },
        "scrollActivate": {
          "title": "Activer ou non le défilement automatique"
        },
        "scrollStep": {
          "title": "Pas de défilement en px pour le défilement vers le bas"
        },
        "scrollInterval": {
          "title": "Intervalle de défilement pour le prochain scrollStep"
        },
        "scrollStart": {
          "title": "Délai avant le défilement vers le bas en ms (après le chargement de l'url)"
        }
      }
    }
  }
}

var nl = {
  "description": "Properties for EXT-Browser plugin",
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
        "displayDelay": {
          "title": "Delay before closing the browser automaticaly in ms. If you want to disable this delay, set it to 0 (default is 60 secs)"
        },
        "scrollActivate": {
          "title": "Activate or not auto-scrolling"
        },
        "scrollStep": {
          "title": "Scrolling step in px for scrolling down"
        },
        "scrollInterval": {
          "title": "Scrolling interval for next scrollStep"
        },
        "scrollStart": {
          "title": "Delay before scrolling down in ms (after url loaded )"
        }
      }
    }
  }
}

exports.default = defaultConfig
exports.schema = schema
exports.fr = fr
exports.nl = nl
