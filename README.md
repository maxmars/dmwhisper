# What's this

DMWhisper is an app that helps Dungeon Masters run Role Playing Games sessions,  
by rolling dices and instantly looking up table items.  

# First installation

### `yarn install`

# Run this project (http://localhost:3000)

### `yarn start`

# Build project (make sure to edit the "homepage" value in package.json)

### `yarn build`

# Creating content

## General format

Content is uploaded in the settings tab.  
It should be created as a JSON file, following this schema:  

    {
        "tree": [
            {
                "id": "text-content",
                "label": "Simple Text Content",
                "type": "information",
                "data": {
                    "textContent": "Please set some meaningful content data, this is just a default stub"
                }
            }
        ],
        "tables": [
            {
                "id": "weathersummer",
                "description": "Weather, summer",
                "tags": ["WEATHER", "SUMMER"],
                "rng": [
                    {
                        "min": 1,
                        "max": 1,
                        "result": "Incredibly hot today, isn't it.",
                    },
                ]
            }
        ]
    }

## The "tree" object

The "tree" object is an array of menu items that will be visible in the app.  
Menu items are made of the following properties:

### `id`

This must be unique in the whole JSON file.  
Do not use dots, spaces or other punctuation symbols other than "-".  

### `label`

This is what will be shown in the menu for this item.  

### `type`

Type is the kind of information conveyed here.  
Valid values are:

- table (used to roll dice)
- information (present a screen of textual information)
- menu (a nested level menu)

### `data`

Contains detailed information about this menu item.
Inside the data object you can store the following properties:

- textContent is used by all node types and is a detailed description about the node.  
- table is only used with table type nodes. You can roll on several tables by separating them with spaces.  
- prefix is only used with table type nodes. The string will be prepended to the dice throws.  
- postfix is only used with table type nodes. The string will be appended to the dice throws.  
- children is only used with menu type nodes to create submenus. Put an array of tree objects inside of it.  

## The "tables" object

Tables are the reason this app was created.  
They are used to roll dices and fetch random values, such as what is the current weather,  
what NPC is the party encountering, etc.  

The tables object is an array of tables, made of the following properties:  

### `id`

This must be unique in the whole JSON file.  
Do not use dots, spaces or other punctuation symbols other than "-".  

### `description`

A description of the current table.  

### `tags`

An array of strings, each one is a tag for the current table.

### `rng`

An array of possible dice results.  
Each rng array item has the following properties:  

- min minimum die value for this item to be returned.  
- max maximum die value for this item to be returned.  
- result is what will be returned.  

In alternative to a plain text "result", you can request a roll on other tables,  
by using the following properties:  
- table (mandatory if you don't specify "result"), one or a (space separated)  
  list of table names (each one will be rolled upon).  
- prefix (optional, to be used if you don't specify "result") the string  
  will be prepended to the dice throws.  
- postfix (optional, to be used if you don't specify "result") the string  
  will be appended to the dice throws.  