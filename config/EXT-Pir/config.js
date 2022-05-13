var defaultConfig = {
  module: 'EXT-Pir',
  disabled: false,
  config: {
    debug: false,
    gpio: 21,
    reverseValue: false
  }
}

var schema = {
  "title": "EXT-Pir",
  "description": "Properties for EXT-Pir plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-Pir"
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
        "gpio": {
          "type": "number",
          "title": "BCM-number of the sensor pin",
          "default": 21,
          "enum": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],
          "minimum": 0,
          "maximum": 26
        },
        "reverseValue": {
          "type": "boolean",
          "title": "Reverse data value received",
          "default": false
        },
      },
      "required": ["gpio"]
    }
  },
  "required": ["module", "config"]
}

var fr = {
  "description": "Propriété du plugin EXT-Pir",
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
        "gpio": {
          "title": "Numéro BCM de la broche du capteur"
        },
        "reverseValue": {
          "title": "Le capteur envoie des valeurs inversées"
        }
      }
    }
  }
}

exports.default = defaultConfig
exports.schema = schema
exports.fr = fr
