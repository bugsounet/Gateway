var defaultConfig = {
  module: 'EXT-Librespot',
  disabled: false,
  config: {
    debug: false,
    email: "",
    password: "",
    deviceName: "MagicMirror",
    minVolume: 50,
    maxVolume: 100
  }
}

var schema = {
  "title": "EXT-Librespot",
  "description": "{PluginDescription}",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "{PluginName}",
      "default": "EXT-Librespot"
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
        "email": {
          "type": "string",
          "title": "Your spotify email",
          "format": "email",
          "default": null
        },
        "password": {
          "type": "string",
          "title": "Your spotify password",
          "default": null
        },
        "deviceName": {
          "type": "string",
          "title": "Define THIS spotify device name",
          "default": "MagicMirror"
        },
        "minVolume": {
          "type": "number",
          "title": "Volume to set when assistant speaking (in %)",
          "default": 50,
          "minimum": 0,
          "maximum": 100
        },
        "maxVolume": {
          "type": "number",
          "title": "Max volume when spotify playing (in %)",
          "default": 100,
          "minimum": 1,
          "maximum": 100
        }
      },
      "required": ["email", "password", "deviceName"]
    }
  },
  "required": ["module", "config"]
}

/*
var fr = {
  "description": "Propriété du plugin EXT-Librespot",
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
        "email": {
          "title": "Votre e-mail spotify"
        },
        "password": {
          "title": "Votre mot de passe Spotify"
        },
        "deviceName": {
          "title": "Définir votre nom de l'appareil Spotify"
        },
        "minVolume": {
          "title": "Volume à régler lorsque l'assistant parle (en %)"
        },
        "maxVolume": {
          "title": "Volume maximum lors de la lecture de Spotify (en %)"
        }
      }
    }
  }
}
*/

exports.default = defaultConfig
exports.schema = schema
