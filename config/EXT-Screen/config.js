var defaultConfig = {
  module: 'EXT-Screen',
  position: 'top_left',
  disabled: false,
  config: {
    debug: false,
    animateBody: true,
    delay: 2 * 60 * 1000,
    turnOffDisplay: true,
    mode: 1,
    ecoMode: true,
    displayCounter: true,
    displayBar: true,
    displayStyle: "Text",
    displayLastPresence: true,
    lastPresenceTimeFormat: "LL H:mm",
    detectorSleeping: false,
    autoHide: true,
    delayed: 0,
    gpio: 20,
    clearGpioValue: true
  }
}

var schema = {
  "title": "EXT-Screen",
  "description": "{PluginDescription}",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "{PluginName}",
      "default": "EXT-Screen"
    },
    "position": {
      "type": "string",
      "title": "{PluginPosition}",
      "default": "top_center",
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
    "config": {
      "type": "object",
      "title": "{PluginConfiguration}",
      "properties": {
        "debug": {
          "type": "boolean",
          "title": "{PluginDebug}",
          "default": false
        },
        "animateBody": {
          "type": "boolean",
          "title": "{EXT-Screen_Body}",
          "default": true
        },
        "delay": {
          "type": "number",
          "title": "{EXT-Screen_Delay}",
          "default": 120000
        },
        "turnOffDisplay": {
          "type": "boolean",
          "title": "{EXT-Screen_Display}",
          "default": true
        },
        "mode": {
          "type": "number",
          "title": "{EXT-Screen_Mode}",
          "default": 1,
          "enum" : [ 0, 1, 2, 3, 4, 5, 6, 7 ],
          "minimum": 0,
          "maximum": 7
        },
        "ecoMode": {
          "type": "boolean",
          "title": "{EXT-Screen_Eco}",
          "default": true
        },
        "displayCounter": {
          "type": "boolean",
          "title": "{EXT-Screen_Counter}",
          "default": true
        },
        "displayBar": {
          "type": "boolean",
          "title": "{EXT-Screen_Bar}",
          "default": true
        },
        "displayStyle": {
          "type": "string",
          "title": "{EXT-Screen_Style}",
          "default": "Text",
          "enum": ["Text", "Line", "SemiCircle", "Circle", "Bar"]
        },
        "displayLastPresence": {
          "type": "boolean",
          "title": "{EXT-Screen_Presence}",
          "default": true
        },
        "lastPresenceTimeFormat": {
          "type": "string",
          "title": "{EXT-Screen_Date}",
          "default": "LL H:mm",
          "enum": ["LL H:mm"]
        },
        "detectorSleeping": {
          "type": "boolean",
          "title": "{EXT-Screen_Sleeping}",
          "default": false
        },
        "autoHide": {
          "type": "boolean",
          "title": "{EXT-Screen_Hide}",
          "default": true
        },
        "delayed": {
          "type": "number",
          "title": "{EXT-Screen_Delayed}",
          "default": 0
        },
        "gpio": {
          "type": "number",
          "title": "{EXT-Screen_GPIO}",
          "default": 20,
          "enum": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],
          "minimum": 0,
          "maximum": 26
        },
        "clearGpioValue": {
          "type": "boolean",
          "title": "{EXT-Screen_Reset}",
          "default": true
        }
      },
      "required": ["mode", "delay"]
    }
  },
  "required": ["module", "config", "position"]
}

exports.default = defaultConfig
exports.schema = schema
