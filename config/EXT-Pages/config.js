var defaultConfig = {
  module: "EXT-Pages",
  position: "bottom_bar",
  disabled: false,
  config: {
    pages: {},
    fixed: [],
    hiddenPages: {},
    animates: {},
    animationTime: 1000,
    rotationTime: 0,
    rotationTimes: {},
    rotationHomePage: 0,
    homePage: 0,
    indicator: true,
    Gateway: {}
  }
}

var schema = {
  "title": "EXT-Pages",
  "description": "{PluginDescription}",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "{PluginName}",
      "default": "EXT-Pages"
    },
    "disabled": {
      "type": "boolean",
      "title": "{PluginDisable}",
      "default": false
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
    "config": {
      "type": "object",
      "title": "{PluginConfiguration}",
      "properties": {
        "pages": {
          "type": "object",
          "default": {},
          "title": "{EXT-Pages_pages}"
        },
        "fixed": {
          "type": "array",
          "default": [],
          "title": "{EXT-Pages_fixed}"
        },
        "hiddenPages": {
          "type": "object",
          "default": {},
          "title": "{EXT-Pages_hiddenPages}"
        },
        "animates": {
          "type": "object",
          "default": {},
          "title": "{EXT-Pages_animates}"
        },
        "animationTime": {
          "type": "number",
          "title": "{EXT-Pages_animationTime}",
          "default": 1000,
          "enum": [0,500,1000,1500,2000],
          "minimum": 0,
          "maximum": 2000
        },
        "rotationTime": {
          "type": "number",
          "title": "{EXT-Pages_rotationTime}",
          "default": 0,
          "enum": [0,5000,10000,15000,20000,25000,30000],
          "minimum": 0,
          "maximum": 30000
        },
        "rotationTimes": {
          "type": "object",
          "default": {},
          "title": "{EXT-Pages_rotationTimes}",
        },
        "rotationHomePage": {
          "type": "number",
          "title": "{EXT-Pages_rotationHomePage}",
          "default": 0,
          "enum": [0,5000,10000,15000,20000,25000,30000],
          "minimum": 0,
          "maximum": 30000
        },
        "homePage": {
          "type": "number",
          "title": "{EXT-Pages_homePage}",
          "default": 0,
          "enum": [0,1,2,3,4,5,6,7,8,9,10],
          "minimum": 0
        },
        "indicator": {
          "type": "boolean",
          "title": "{EXT-Pages_indicator}",
          "default": true
        },
        "Gateway": {
          "title": "{EXT-Pages_Gateway}",
          "type": "object",
          "default": {}
        }
      }
    }
  },
  "required": ["module", "config"]
}

exports.default = defaultConfig
exports.schema = schema
