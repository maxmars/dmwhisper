# What's this

DMWhisper is an app that helps Dungeon Masters run Role Playing Games sessions,  
by rolling dice and instantly looking up table items.  

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
They are used to roll dice and fetch random values, such as what is the current weather,  
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

## Examples

Here are a few examples that implement what was described in the previous chapters.  

### `tree object - a typical menu`

    {
        "id": "farm",
        "label": "A farm just out of the town",
        "type": "menu",
        "data": {
            "textContent": "The farm just out of the town",
            "children": [
                    {
                        "id": "farm-description",
                        "label": "A description of the farm",
                        "type": "information",
                        "data": {
                            "textContent": "The farm is located between the city gates, the forest and the wizard's castle, which is located on the hill. The farm is run by an old farmer and his wife, who have a 10 year old son. The farm is surrounded by a stone wall, with a wooden gate. The house is a wooden construction with a thatched roof. The farm has a small vegetable garden, a chicken coop, a sheep pen and a pig pen. The farm also has a water well."
                        }
                    },

                    ... Other menu items ...
            ]
        }
    }

### `tree object - a typical description`

    {
        "id": "farm-description",
        "label": "A description of the farm",
        "type": "information",
        "data": {
            "textContent": "The farm is located between the city gates, the forest and the wizard's castle, which is located on the hill. The farm is run by an old farmer and his wife, who have a 10 year old son. The farm is surrounded by a stone wall, with a wooden gate. The house is a wooden construction with a thatched roof. The farm has a small vegetable garden, a chicken coop, a sheep pen and a pig pen. The farm also has a water well."
        }
    }

### `tree object - a typical table`

    {
        "id": "events-farm",
        "label": "The events around the farm",
        "type": "table",
        "data": {
            "textContent": "Events around the farm",
            "table": "farm-events"
        },
    }

### `table object - a typical values-only table`

        {
            "id": "farm-weather",
            "description": "Weather around the farm",
            "tags": ["weather", "farm"],
            "rng": [
                {
                    "min": 1,
                    "max": 1,
                    "result": "Cold and foggy",
                },
                {
                    "min": 2,
                    "max": 4,
                    "result": "Cool",
                },
                {
                    "min": 5,
                    "max": 8,
                    "result": "Wind and rain",
                },
                {
                    "min": 9,
                    "max": 11,
                    "result": "Warm and sunny",
                },
                {
                    "min": 12,
                    "max": 18,
                    "result": "Temperate and variable",
                },
                {
                    "min": 19,
                    "max": 20,
                    "result": "Unbearable heat",
                },
            ]
        }

### `table object - a typical table linked to other tables`

The first table here contains references to the two tables next to it.

    {
        "id": "farm-npc",
        "description": "NPCs around the farm",
        "tags": ["npc", "farm"],
        "rng": [
            {
                "min": 1,
                "max": 1,
                "result": "Marius the farmer, leaning on his shovel",
            },
            {
                "min": 2,
                "max": 4,
                "prefix": "From the castle.. ",
                "table": "castle-npc",
            },
            {
                "min": 5,
                "max": 8,
                "result": "Marius the farmer, harvesting potatoes",
            },
            {
                "min": 9,
                "max": 11,
                "result": "Evelina the peasant woman who cleans the farmyard",
            },
            {
                "min": 12,
                "max": 16,
                "result": "Raimondo the little rascal, who makes faces",
            },
            {
                "min": 17,
                "max": 20,
                "prefix": "From the city.. ",
                "table": "city-npc",
            },
        ]
    },        
    {
        "id": "castle-npc",
        "description": "NPCs around the castle",
        "tags": ["npc", "castle"],
        "rng": [
            {
                "min": 1,
                "max": 1,
                "result": "The wizard, who looks at you curiously",
            },
            {
                "min": 2,
                "max": 4,
                "result": "Battista the butler, who looks at you suspiciously",
            },
            {
                "min": 5,
                "max": 8,
                "result": "Maria the cook, who looks at you distractedly",
            },
            {
                "min": 9,
                "max": 11,
                "result": "The castle gamekeeper",
            },
            {
                "min": 12,
                "max": 18,
                "result": "Two students of magic, disciples of the castle wizard",
            },
            {
                "min": 19,
                "max": 20,
                "result": "The wizard of the castle looking out of breath",
            },
        ]
    },    
    {
        "id": "city-npc",
        "description": "NPCs around the city",
        "tags": ["npc", "city"],
        "rng": [
            {
                "min": 1,
                "max": 1,
                "result": "The mayor's wife",
            },
            {
                "min": 2,
                "max": 4,
                "result": "The mayor",
            },
            {
                "min": 5,
                "max": 8,
                "result": "A market trader",
            },
            {
                "min": 9,
                "max": 11,
                "result": "Two city guards",
            },
            {
                "min": 12,
                "max": 18,
                "result": "A citizen who looks at you with curiosity",
            },
            {
                "min": 19,
                "max": 20,
                "result": "A schoolgirl from the city",
            },
        ]
    }

# Log of Changes

    23 Aug 2023
    -----------
    - 1.0.6 Added consulting mode to tables

    20 Aug 2023
    -----------
    - 1.0.5 Four seconds auto update on tables, as an option
    - 1.0.4 Error handling for user provided JSON content
  
    19 Aug 2023
    -----------
    - 1.0.3 a new set of example data, plus an update to the docs
    - 1.0.2 Small cosmetic changes and a custom icon
    - 1.0.1 Info section

    18 Aug 2023
    -----------
    - 1.0.0 Initial release
  