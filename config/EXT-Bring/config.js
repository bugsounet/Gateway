var defaultConfig = {
  module: 'EXT-Bring',
  position: 'top_right',
  disabled: false,
  config: {
    debug: false,
    listName: "Liste",
    email: null,
    password: null,
    lang: 0,
    columns: 3,
    maxRows: 5,
    updateInterval: 30000,
    showBackground: true,
    showBox: true,
    showHeader: true
  }
}

var schema = {
  "title": "EXT-Bring",
  "description": "Properties for EXT-Bring plugin",
  "type": "object",
  "properties": {
    "module": {
      "type": "string",
      "title": "Plugin name",
      "default": "EXT-Bring"
    },
    "disabled": {
      "type": "boolean",
      "title": "Disable the plugin",
      "default": false
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
    "config": {
      "type": "object",
      "title": "Configuration",
      "properties": {
        "debug": {
          "type": "boolean",
          "title": "Enable debug mode",
          "default": false
        },
        "listName": {
          "type": "string",
          "title": "What is your list name in Bring!",
          "default": "Liste"
        },
        "email": {
          "type": "string",
          "title": "Your email of your Bring! account?",
          "format": "email"
        },
        "password": {
          "type": "string",
          "title": "Your password of your Bring! account?",
          "default": "secret"
        },
        "lang": {
          "type": "number",
          "title": "Choose your language number",
          "default": 0,
          "enum": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
          "minimum": 0,
          "maximum": 20
        },
        "columns": {
          "type": "number",
          "title": "The number of colums in the table view",
          "default": 0,
          "enum": [0,1,2,3,4,5,6,7,8,9,10],
          "minimum": 1,
          "maximum": 10
        },
        "maxRows": {
          "type": "number",
          "title": "The maximum number of rows to display in the table view",
          "default": 0,
          "enum": [0,1,2,3,4,5,6,7,8,9,10],
          "minimum": 1,
          "maximum": 10
        },
        "updateInterval": {
          "type": "number",
          "title": "The update frequency in milliseconds.(1000ms = 1sec)",
          "default": 30000,
          "enum": [15000,30000,60000,90000,120000],
          "minimum": 15000,
          "maximum": 120000
        },
        "showBackground": {
          "type": "boolean",
          "title": "Display a Background around item place",
          "default": true
        },
        "showBox": {
          "type": "boolean",
          "title": "Display a Box around items",
          "default": true
        },
        "showHeader": {
          "type": "boolean",
          "title": "Display the name of the shopping list in header of the plugin",
          "default": true
        }
      },
      "required": ["email","password"]
    }
  },
  "required": ["config","module", "position"]
}

var fr = {
  "description": "Propriété pour le plugin EXT-Bring",
  "properties": {
    "module": {
      "title": "Nom du plugin"
    },
    "disabled": {
      "title": "Désactiver le plugin"
    },
    "position": {
      "title": "Position du plugin"
    },
    "config": {
      "title": "Configuration",
      "properties": {
        "debug": {
          "title": "Activer le mode debug"
        },
        "listName": {
          "title": "Quel est le nom de votre liste de courses dans Bring !"
        },
        "email": {
          "title": "Votre email de votre compte Bring!"
        },
        "password": {
          "title": "Votre mot de passe de votre compte Bring!"
        },
        "lang": {
          "title": "Choisissez votre numéro de langue"
        },
        "columns": {
          "title": "Le nombre de colonnes dans le tableau"
        },
        "maxRows": {
          "title": "Nombre maximum de lignes à afficher dans le tableau"
        },
        "updateInterval": {
          "title": "Fréquence de mise à jour en millisecondes.(1000ms = 1sec)"
        },
        "showBackground": {
          "title": "Afficher un arrière-plan autour de l'emplacement de l'élément"
        },
        "showBox": {
          "title": "Affiche une boîte autour des éléments"
        },
        "showHeader": {
          "title": "Afficher le nom de la liste de courses dans l'en-tête du plugin"
        }
      }
    }
  }
}

var nl = {
  "description": "Eigenschappen van de EXT-Bring plugin",
  "properties": {
    "module": {
      "title": "Plugin naam"
    },
    "disabled": {
      "title": "De plugin uitschakelen"
    },
    "position": {
      "title": "Positie van de Plugin"
    },
    "config": {
      "title": "Instellingen",
      "properties": {
        "debug": {
          "title": "Debug modus aanzetten"
        },
        "listName": {
          "title": "Wat is de naam van je lijst in Bring!"
        },
        "email": {
          "title": "Uw emailadres van uw Bring! account?"
        },
        "password": {
          "title": "Uw wachtwoord van uw Bring! account?"
        },
        "lang": {
          "title": "Kies uw taal nummer"
        },
        "columns": {
          "title": "Het aantal kolommen in uw weergave"
        },
        "maxRows": {
          "title": "Het maximum aantal rijen dat vertoont word in uw weergave"
        },
        "updateInterval": {
          "title": "Refresh frequentie in milliseconden.(1000ms = 1sec)"
        },
        "showBackground": {
          "title": "Uw items met een achtergrond vertonen"
        },
        "showBox": {
          "title": "Uw items omkaderen"
        },
        "showHeader": {
          "title": "Toon de naam van uw boodschappenlijst in de hoofding van de plugin"
        }
      }
    }
  }
}

exports.default = defaultConfig
exports.schema = schema
exports.fr = fr
exports.nl = nl
