var defaultConfig = {
  module: "EXT-Detector",
  position: "top_left",
  disabled: false,
  configDeepMerge: true,
  config: {
    debug: false,
    useIcon: true,
    touchOnly: false,
    detectors: [
      {
        detector: "Snowboy",
        Model: "jarvis",
        Sensitivity: null
      },
      {
        detector: "Porcupine",
        Model: "ok google",
        Sensitivity: null
      },
      {
        detector: "Porcupine",
        Model: "hey google",
        Sensitivity: null
      }
    ]
  }
}

var schema = {
  "title": "EXT-Detector",
  "description": "{PluginDescription}",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "{PluginName}",
      "default": "EXT-Detector"
    },
    "position": {
      "type": "string",
      "title": "{PluginPosition}",
      "default": "top_right",
      "enum": [
        "top_bar",
        "top_left",
        "top_center",
        "top_right",
        "upper_third",
        "middle_center",
        "lower_third",
        "bottom_left",
        "bottom_center",
        "bottom_right",
        "bottom_bar",
        "fullscreen_above",
        "fullscreen_below"
      ]
    },
    "disabled": {
      "type": "boolean",
      "title": "{PluginDisable}",
      "default": false
    },
    "configDeepMerge": {
      "type": "boolean",
      "title": "{PluginConfigDeepMerge}",
      "default": true
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
        "useIcon": {
          "type": "boolean",
          "title": "{EXT-Detector_Icon}",
          "default": true
        },
        "touchOnly": {
          "type": "boolean",
          "title": "{EXT-Detector_Touch}",
          "default": false
        },
        "detectors": {
          "type": "array",
          "title": "{EXT-Detector_Detector}",
          "default": [],
          "minItems": 1,
          "items": {
            "properties": {
              "detector": {
                "type": "string",
                "title": "{EXT-Detector_Engine}",
                "enum": ["Snowboy","Porcupine"],
                "default": "Snowboy"
              },
              "Model": {
                "type": "string",
                "title": "{EXT-Detector_Keyword}",
                "default": "jarvis",
                "enum": [ 
                  "smart_mirror",
                  "jarvis",
                  "computer",
                  "snowboy",
                  "subex",
                  "neo_ya",
                  "hey_extreme",
                  "view_glass",
                  "americano",
                  "blueberry",
                  "bumblebee",
                  "grapefruit",
                  "grasshopper",
                  "hey google",
                  "hey siri",
                  "ok google",
                  "picovoice",
                  "porcupine",
                  "terminator"
                ]
              },
              "Sensitivity": {
                "title": "{EXT-Detector_Sensitivity}",
                "type": ["number", "null"],
                "default": null,
                "enum": [
                  null,
                  0,
                  0.1,
                  0.2,
                  0.3,
                  0.4,
                  0.5,
                  0.6,
                  0.7,
                  0.8,
                  0.9,
                  1.0
                ]
              }
            },
            "required": ["detector", "Model", "Sensitivity"]
          },
          "additionalItems": {
            "properties": {
              "detector": {
                "type": "string"
              },
              "Model": {
                "type": "string"
              },
              "Sensitivity": {
                "type": ["number", "null"]
              }
            }
          }
        }
      }
    }
  },
  "required": ["module", "position", "config"]
}

exports.default = defaultConfig
exports.schema = schema
