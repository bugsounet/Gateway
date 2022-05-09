var defaultConfig = {
  module: 'EXT-GooglePhotos',
  position: 'top_left',
  disabled: false,
  config: {
    debug: false,
    displayType: 0,
    displayDelay: 10 * 1000,
    displayInfos: true,
    albums: [],
    sort: "new", // "old", "random"
    hiResolution: true,
    timeFormat: "DD/MM/YYYY HH:mm",
    moduleHeight: 300,
    moduleWidth: 300
  }
}

var schema = {
  "title": "EXT-GooglePhotos",
  "description": "Properties for EXT-GooglePhotos",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-GooglePhotos"
    },
    "position": {
      "type": "string",
      "title": "Plugin position",
      "default": "top_left",
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
        "displayType": {
          "type": "number",
          "title": "How displaying Google Photos? (0: in Fullscreen, 1: in MagicMirror position)",
          "default": 0,
          "enum": [ 0 , 1 ]
          "minimum": 0,
          "maximum": 1
        },
        "displayDelay": {
          "type": "number",
          "title": "Delay before displaying next photo in the iframe (default is 10 secs)",
          "default": 10000
        },
        "displayInfos": {
          "type": "boolean",
          "title": "Displaying name of the album and photo time",
          "default": true
        },
        "albums": {
          "type": "array",
          "title": "Album Folders names of Google Photos to display",
          "default": [],
          "minItems": 1,
          "uniqueItems": true
          "items": {
            "type": "string"
          }
        },
        "sort": {
          "type": "string",
          "title": "Sort received google photos new, old, random",
          "default": "new",
          "enum": [ "new", "old" , "random" ]
        },
        "hiResolution": {
          "type": "boolean",
          "title": "Displaying photos in Hi-Resolution",
          "default": true
        },
        "timeFormat": {
          "type": "string",
          "title": "Sort received google photos new, old, random",
          "default": "DD/MM/YYYY HH:mm",
          "enum": [ "DD/MM/YYYY HH:mm", "DD/MM/YYYY" , "YYYY/DD/MM HH:mm" , "YYYY/DD/MM"  ]
        },
        "moduleHeight": {
          "type": "number",
          "title": "module Height in px",
          "default": 10000
        },
        "moduleWidth": {
          "type": "number",
          "title": "module Width in px",
          "default": 10000
        },
      },
      "required": ["albums"]
    }
  },
  "required": ["module", "config"]
}

exports.default = defaultConfig
exports.schema = schema
