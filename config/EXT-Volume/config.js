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
  "description": "Properties for EXT-Volume plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-Volume"
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

exports.default = defaultConfig
exports.schema = schema
