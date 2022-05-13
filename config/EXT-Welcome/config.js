var defaultConfig = {
  module: "EXT-Welcome",
  disabled: false,
  config: {
    welcome: "brief Today"
  }
}

exports.default = defaultConfig

var schema = {
    "title": "EXT-Welcome",
    "description": "properties for EXT-Welcome",
    "type": "object",
    "properties": {
      "module": {
        "type": "string",
        "title": "Plugin name",
        "default": "EXT-Welcome"
      },
      "disabled": {
        "type": "boolean",
        "title": "disable the plugin",
        "default": false
      },
      "config": {
        "type": "object",
        "title": "Configuration",
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

exports.default = defaultConfig
exports.schema = schema
exports.fr = fr
