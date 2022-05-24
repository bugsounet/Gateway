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
          "title": "{EXT-Volume_Preset}",
          "default": "PULSE",
          "enum": ["ALSA", "ALSA_HDMI", "ALSA_HEADPHONE", "PULSE", "HIFIBERRY-DAC", "RESPEAKER_SPEAKER", "RESPEAKER_PLAYBACK", "OSX" ]
        },
        "myScript": {
          "type": ["string", "null"],
          "title": "{EXT-Volume_Script}",
          "default": null
        }
      },
      "required": ["volumePreset"]
    }
  },
  "required": ["module", "config"]
}

exports.default = defaultConfig
exports.schema = schema
