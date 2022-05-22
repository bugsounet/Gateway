var defaultConfig = {
  module: 'EXT-Volume',
  disabled: false,
  config: {
    debug: false,
    volumePreset: "PULSE",
    myScript: null
  }
}

var schema = {
  "title": "EXT-Volume",
  "description": "{PluginDescription}",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "{PluginName}",
      "default": "EXT-Volume"
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
        "volumePreset": {
          "type": "string",
          "title": "Preset volume configuration type",
          "default": "PULSE",
          "enum": ["ALSA", "ALSA_HDMI", "ALSA_HEADPHONE", "PULSE", "HIFIBERRY-DAC", "RESPEAKER_SPEAKER", "RESPEAKER_PLAYBACK", "OSX" ]
        },
        "myScript": {
          "type": ["string", "null"],
          "title": "Own script for volume control",
          "default": null
        }
      },
      "required": ["volumePreset"]
    }
  },
  "required": ["module", "config"]
}

/*
var fr = {
  "description": "Propriété pour le plugin EXT-Volume",
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
        "volumePreset": {
          "title": "Type de configuration de volume prédéfini"
        },
        "myScript": {
          "title": "Votre propre script pour le contrôle du volume"
        }
      }
    }
  }
}
*/

exports.default = defaultConfig
exports.schema = schema
