var defaultConfig = {
  module: 'EXT-Governor',
  disabled: false,
  config: {
    debug: false,
    sleeping: "powersave",
    working: "ondemand"
  }
}

var schema = {
  "title": "EXT-Governor",
  "description": "Properties for EXT-Governor plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-Governor"
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
        "sleeping": {
          "type": "string",
          "title": "Name of the governor when screen is in sleeping state",
          "default": "powersave",
          "enum": [ "ondemand", "powersave", "performance", "conservative" , "userspace"  ]
        },
        "working": {
          "type": "string",
          "title": "Name of the governor when screen is actived",
          "default": "ondemand",
          "enum": [ "ondemand", "powersave", "performance", "conservative" , "userspace"  ]
        },
      }
    }
  },
  "required": ["module"]
}

exports.default = defaultConfig
exports.schema = schema
