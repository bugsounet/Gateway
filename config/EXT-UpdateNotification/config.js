var defaultConfig = {
  module: "EXT-UpdateNotification",
  position: "top_bar",
  configDeepMerge: true,
  disabled: false,
  config: {
    debug: false,
    updateInterval: 10 * 60 * 1000, // every 10 minutes
    startDelay: 60 * 1000, // delay before 1st scan
    ignoreModules: [],
    notification: {
      useTelegramBot: true,
      sendReady: true,
      useScreen: true,
      useCallback: true
    },
    update: {
      autoUpdate: true,
      autoRestart: true,
      usePM2: false,
      PM2Name: "0",
      logToConsole: true,
      timeout: 2*60*1000
    }
  }
}

var schema = {
  "title": "EXT-UpdateNotification",
  "description": "{PluginDescription}",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "{PluginName}",
      "default": "EXT-UpdateNotification"
    },
    "position": {
      "type": "string",
      "title": "{PluginPosition}",
      "default": "top_bar",
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
    "configDeepMerge": {
      "type": "boolean",
      "title": "{PluginConfigDeepMerge}",
      "default": true
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
        "updateInterval": {
          "type": "number",
          "title": "{EXT-UpdateNotification_Interval}",
          "default": 600000
        },
        "startDelay": {
          "type": "number",
          "title": "{EXT-UpdateNotification_Delay}",
          "default": 60000
        },
        "ignoreModules": {
          "type": "array",
          "title": "{EXT-UpdateNotification_Ignore}",
          "default": [],
          "item": {
            "type": "string"
          }
        },
        "notification": {
          "type": "object",
          "title": "{EXT-UpdateNotification_Notification}",
          "properties": {
            "useTelegramBot" : {
              "type": "boolean",
              "title": "{EXT-UpdateNotification_TB}",
              "default": true
            },
            "sendReady": {
              "type": "boolean",
              "title": "{EXT-UpdateNotification_Ready}",
              "default": true
            },
            "useScreen": {
              "type": "boolean",
              "title": "{EXT-UpdateNotification_Screen}",
              "default": true
            },
            "useCallback": {
              "type": "boolean",
              "title": "{EXT-UpdateNotification_Callback}",
              "default": true
            }
          }
        },
        "update": {
          "type": "object",
          "title": "{EXT-UpdateNotification_Update}",
          "properties" : {
            "autoUpdate" : {
              "type": "boolean",
              "title": "{EXT-UpdateNotification_AutoUpdate}",
              "default": true
            },
            "autoRestart": {
              "type": "boolean",
              "title": "{EXT-UpdateNotification_AutoRestart}",
              "default": true
            },
            "PM2Name": {
              "type": ["string", "number"],
              "title": "{EXT-UpdateNotification_PM2}",
              "default": 0
            },
            "logToConsole": {
              "type": "boolean",
              "title": "{EXT-UpdateNotification_Log}",
              "default": true
            },
            "timeout": {
              "type": "number",
              "title": "{EXT-UpdateNotification_Timeout}",
              "default": 120000
            }
          }
        }
      }
    }
  },
  "required": ["module", "config", "position", "configDeepMerge"]
}

exports.default = defaultConfig
exports.schema = schema
