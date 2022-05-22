var defaultConfig = {
  module: "EXT-Welcome",
  disabled: false,
  config: {
    welcome: "brief Today"
  }
}

var schema = {
    "title": "EXT-Welcome",
    "description": "{PluginDescription}",
    "type": "object",
    "properties": {
      "module": {
        "type": "string",
        "title": "{PluginName}",
        "default": "EXT-Welcome"
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
          "welcome": {
            "type": "string",
            "title": "Your assistant welcome",
            "default": "brief Today"
          }
        },
        "required": ["welcome"]
      }
    },
    "required": ["config","module"]
}

/*
var fr = {
    "description": "Propriété pour le plugin EXT-Welcome",
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
          "welcome": {
            "title": "Votre demande de bienvenue"
          }
        }
      }
    }
}
*/

exports.default = defaultConfig
exports.schema = schema
