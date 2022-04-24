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
  "description": "Properties for EXT-Background plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-Background"
    },
    "disabled": {
      "type": "boolean",
      "title": "Disable the plugin",
      "default": false
    },
    "config": {
      "type": "object",
      "title": "configuration",
      "properties": {
        "model": {
          "type": "string",
          "title": "Choose your model",
          "default": "jarvis",
          "enum": ["jarvis", "lego", "old", "cortana"]
        },
        "myImage": {
          "type": ["string", "null"],
          "title": "Choose your personal image, if don't don't want model",
          "default": null,
        },
      },
      "required": ["model"]
    }
  },
  "required": ["config","module"]
}

exports.default = defaultConfig
exports.schema = schema
