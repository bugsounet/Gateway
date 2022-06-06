var defaultConfig = {
  module: 'EXT-Volume',
  disabled: false,
  config: {
    debug: false,
    volumePreset: "PULSE",
    myScript: null,
    startVolume: 100
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
        },
        "startVolume": {
          "type": "number",
          "title": "{EXT-Volume_Start}",
          "default": 100,
          "enum": [0,10,20,30,40,50,60,70,80,90,100],
          "minimum": 0,
          "maximum": 100
        }
      },
      "required": ["volumePreset"]
    }
  },
  "required": ["module", "config"]
}

exports.default = defaultConfig
exports.schema = schema
