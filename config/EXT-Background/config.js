var defaultConfig = {
  module: "EXT-Background",
  disabled: false,
  config: {
    model: "jarvis",
    myImage: null
  }
}

var schema = {
  "title": "EXT-Background",
  "description": "{PluginDescription}",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "{PluginName}",
      "default": "EXT-Background"
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
        "model": {
          "type": "string",
          "title": "Choose your model",
          "default": "jarvis",
          "enum": ["jarvis", "lego", "old", "cortana"]
        },
        "myImage": {
          "type": ["string", "null"],
          "title": "Choose your personal image, if don't want model",
          "default": null
        }
      },
      "required": ["model"]
    }
  },
  "required": ["config","module"]
}

/*
var fr = {
  "properties": {
    "config": {
      "properties": {
        "model": {
          "title": "Choisissez votre modèle"
        },
        "myImage": {
          "title": "Choisissez votre image personnelle, si vous ne voulez pas de modèle"
        }
      }
    }
  }
}

var nl = {
  "properties": {
    "config": {
      "properties": {
        "model": {
          "title": "Kies uw model"
        },
        "myImage": {
          "title": "Kies zelf een afbeelding, als je geen model wilt"
        }
      }
    }
  }
}
*/

exports.default = defaultConfig
exports.schema = schema
