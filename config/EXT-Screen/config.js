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
  "description": "Properties for EXT-Screen plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-Screen"
    },
    "position": {
      "type": "string",
      "title": "Plugin position",
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
        "animateBody": {
          "type": "boolean",
          "title": "Animate MagicMirror on turn on/off the screen",
          "default": true
        },
        "delay": {
          "type": "number",
          "title": "Time before the mirror turns off the display if no user activity is detected. (in ms)",
          "default": 120000
        },
        "turnOffDisplay": {
          "type": "boolean",
          "title": "Should the display turn off after timeout?",
          "default": true
        },
        "mode": {
          "type": "number",
          "title": "mode for turn on/off your screen (see wiki)",
          "default": 1,
          "enum" : [ 0, 1, 2, 3, 4, 5, 6, 7 ],
          "minimum": 0,
          "maximum": 7
        },
        "ecoMode": {
          "type": "boolean",
          "title": "Should the MagicMirror hide all module after timeout ?",
          "default": true
        },
        "displayCounter": {
          "type": "boolean",
          "title": "Should display Count-down in screen ?",
          "default": true
        },
        "displayBar": {
          "type": "boolean",
          "title": "Should display Count-up bar in screen ?",
          "default": true
        },
        "displayStyle": {
          "type": "string",
          "title": "Style of the Counter ?",
          "default": "Text",
          "enum": ["Text", "Line", "SemiCircle", "Circle", "Bar"]
        },
        "displayLastPresence": {
          "type": "boolean",
          "title": "Display the date of the last user presence",
          "default": true
        },
        "lastPresenceTimeFormat": {
          "type": "string",
          "title": "Change the date format (moment.js format) of the last presence",
          "default": "LL H:mm",
          "enum": ["LL H:mm"]
        },
        "detectorSleeping": {
          "type": "boolean",
          "title": "Activate ONLY EXT-Detector only when display is on",
          "default": false
        },
        "autoHide": {
          "type": "boolean",
          "title": "Auto Hide this module when the lock function is activated",
          "default": true
        },
        "delayed": {
          "type": "number",
          "title": "Delayed turn on screen time (only if your screen is off). (in ms)",
          "default": 0
        },
        "gpio": {
          "type": "number",
          "title": "GPIO number for control the relay (mode 6 only)",
          "default": 20,
          "enum": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],
          "minimum": 0,
          "maximum": 26
        },
        "clearGpioValue": {
          "type": "boolean",
          "title": "Reset GPIO value script of relay (mode 6 only)",
          "default": true
        }
      },
      "required": ["mode", "delay"]
    }
  },
  "required": ["module", "config"]
}

exports.default = defaultConfig
exports.schema = schema
