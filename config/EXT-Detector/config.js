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
  "description": "Properties for EXT-Detector plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-Detector"
    },
    "position": {
      "type": "string",
      "title": "Plugin position",
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
      "title": "Disable the plugin",
      "default": false
    },
    "configDeepMerge": {
      "type": "boolean",
      "title": "Automatically merge with the default configuration if a feature is missing in the configuration",
      "default": true
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
        "useIcon": {
          "type": "boolean",
          "title": "Display Google Icon and animate it when keyword discover",
          "default": true
        },
        "touchOnly": {
          "type": "boolean",
          "title": "Activate MMM-GoogleAssistant by Touch the Google Icon only and don't listen any keywords",
          "default": false
        },
        "detectors": {
          "type": "array",
          "title": "Array of detectors",
          "default": [],
          "minItems": 1,
          "items": {
            "properties": {
              "detector": {
                "type": "string",
                "title": "Detector engine",
                "enum": ["Snowboy","Porcupine"],
                "default": "Snowboy"
              },
              "Model": {
                "type": "string",
                "title": "Keyword name",
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
                "title": "Sensitivity of detection of the keyword",
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
            /* don't works ... need review
            "if": {
              "properties": {
                "detector" : {
                  "enum":  [ "Snowboy" ]
                }
              }
            },
            "then": {
              "properties": {
                "Models": {
                  "enum": [ 
                    "smart_mirror",
                    "jarvis",
                    "computer",
                    "snowboy",
                    "subex",
                    "neo_ya",
                    "hey_extreme",
                    "view_glass"
                  ]
                }
              }
            },
            */
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

var fr = {
  "description": "Propriété pour le plugin EXT-Detector",
  "properties": {
    "module": {
      "title": "Nom du plugin"
    },
    "position": {
      "title": "Position du plugin"
    },
    "disabled": {
      "title": "Désactiver le plugin"
    },
    "configDeepMerge": {
      "title": "Fusionner automatiquement avec la configuration par défaut si une fonctionnalitée manque dans la configuration"
    },
    "config": {
      "title": "Configuration",
      "properties": {
        "debug": {
          "title": "Activer le mode debug"
        },
        "useIcon": {
          "title": "Afficher l'icône Google et l'animer lorsque le mot clé est découvert"
        },
        "touchOnly": {
          "title": "Activez MMM-GoogleAssistant en appuyant uniquement sur l'icône Google et écoute aucun mot-clé"
        },
        "detectors": {
          "title": "Gamme des détecteurs",
          "items": {
            "properties": {
              "detector": {
                "title": "Moteur de détection"
              },
              "Model": {
                "title": "Nom du mot clé"
              },
              "Sensitivity": {
                "title": "Sensibilité de détection du mot clé"
              }
            }
          }
        }
      }
    }
  }
}

exports.default = defaultConfig
exports.schema = schema
exports.fr = fr
