# What's this

DMWhisper is an app that helps Dungeon Masters run Role Playing Games sessions,  
by rolling dice, instantly looking up table items, read text notes, all organized as a single content tree.  

In this repository you will find all the source files needed to build, run and modify DMWhisper.

# I'm not a developer. I just want to use DMWhisper. Is it possible?  

Sure thing. The most up to date version of DMWhisper can be accessed here:

https://marsiglietti.it/dmwhisper/

# First installation

### `yarn install`

After that, you need to install a custom CKEditor build that is conveniently located as a subfolder of the main project folder. Do that with:

### `yarn add file:./ckeditor5`

# Run this project

### `yarn start`

After that, open [http://localhost:3000](http://localhost:3000) to view it in the browser, if it doesn't open automatically.

# Build project (make sure to edit the "homepage" value in package.json)

### `yarn build`

# Legal notices

In addition to the Apache 2.0 license (that you can find in the same directory as this file), this project uses the following licensed third party libraries:

CKEditor 5, which is licensed from CKSource (www.cksource.com).

Please note that:

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL CKSOURCE OR ITS LICENSORS BE LIABLE FOR ANY CLAIM, DAMAGES
OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

The same conditions apply to DMWhisper -- it is provided "as is", without warranty of any kind, express or implied.
Feel free to use it but please note that the authors are not responsible for any damage that may occur from its use.

# Creating content

## In app

Since version 1.1.0 it is now possible to author your content directly in app.
DMWhisper content is made up of:

- tables: these are collections of values that you can roll upon. 
          E.g. a weather table may have a value of "rainy" when rolling 1,
          "foggy" when rolling 2, etc.
- menus: by means of menu items you build a content tree, whose leaves are
         either tables (defined above) or simple text (information) nodes.

## Import JSON text (paste into the "edit" tab)

Content can be also uploaded in the "edit" tab.  
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

## Import JSON text (pass it on the webapp URL)
If you're using the webapp version of DMWhisper, you can also pass the JSON content as a parameter in the URL, like this:

    https://marsiglietti.it/dmwhisper/?datafile=https://marsiglietti.it/dmwhisper/data.json

Please note that nowadays this only works if both URLs are on the same site or if the server that contains the data file allows all origins:

Access-Control-Allow-Origin: *

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

    18 Dic 2024
    -----------
    - 1.54.0 You can now save and load saved content, of any kind.

    17 Dic 2024
    -----------
    - 1.57.0 Export saved content to PDF.

    16 Dic 2024
    -----------
    - 1.52.0 Implemented counters.
    - 1.51.0 Puzzle set items can now be laid out in order (shuffled among non ordered items)

    10 Dic 2024
    -----------
    - 1.50.0 Now you can link to dungeons and content pages from a content page / table item.

    16 Ott 2024
    -----------
    - 1.40.2 Squashed small bug on AreaMap navigation.

    03 Ott 2024
    -----------
    - 1.40.1 On browsers that allow it, pressing "back" browser button now goes back one level. Chrome does not allow this fully (you have to interact with the page between "back" button presses), but Firefox does.

    29 Set 2024
    -----------
    - 1.40.0 Random dungeon generator! You can now add dungeons to your content and generate them on the fly.

    04 Set 2024
    -----------
    - 1.32.0 Added the "test" menu item.

    03 Set 2024
    -----------
    - 1.31.0 More readable names for map elements.

    16 Giu 2024
    -----------
    - 1.30.0 You can now shuffle tables values and save the shuffled list.
    - 1.29.0 You can now set min and max values to roll on for table contents (only for single tables); table values in the "browse" mode are now sorted.

    15 Giu 2024
    -----------
    - 1.28.0 You can now filter, delete and copy to clipboard saved content.

    14 Giu 2024
    -----------
    - 1.27.0 You can now edit saved table rolls / information bits (but not maps stuff).

    06 Giu 2024
    -----------
    - 1.26.3 Fixed the manual and the default data.

    05 Giu 2024
    -----------
    - 1.26.2 Fixed dice roll related bug.

    31 Mag 2024
    -----------
    - 1.26.1 Fixed corrupted setpiece saves.

    30 Mag 2024
    -----------
    - 1.26.0 Further map generator stuff.

    27 Mag 2024
    -----------
    - 1.25.0 Further map generator stuff.
    - 1.24.0 Extra robustness + map generator.

    22 Mag 2024
    -----------
    - 1.23.0 Extra robustness + error handling, now unique table results are unique even for inner tables.

    21 Mag 2024
    -----------
    - 1.22.0 It is now possible to request unique values when rolling results on a table. Please use the "unique?" checkbox when adding tables to a page.
    - 1.21.0 You can now have DMWhisper roll dice by adding one or more {{XdY}}, {{XdY+Z}}, {{XdY-Z}} string to your pages of type "table".
             DMWhisper is now more resilient to crashes.
             If you reference the same die roll multiple times in the same page with the @@xy string, ALL strings will be replaced with the die roll and not just the first one.
             
    26 Dic 2023
    -----------
    - 1.20.1 small but important fixes.

    08 Dic 2023
    -----------
    - 1.20.0 Warnings about unsaved content.

    06 Dic 2023
    -----------
    - 1.19.3 Fixed a small but nasty bug that made content reset on tab switch, only for certain content ids.
    - 1.19.2 Fixed a cosmetic bug when showing table content.

    04 Dic 2023
    -----------
    - 1.19.1 Fixed a bug that caused an endless loop.

    27 Nov 2023
    -----------
    - 1.19.0 Content is not automatically reset anymore when you switch tabs; improved random number generation.

    23 Nov 2023
    -----------
    - 1.18.0 It's now possible to enter tables into the table definition UX using an autocomplete
    - 1.17.0 It's now possible to mix tables and fixed text for the table id field; precedently it was either a single table id to roll on, or several table ids separated by spaces.

    12 Nov 2023
    -----------
    - 1.16.3 Fixed a problem with content not updating when using the bottom navigation arrows.

    03 Nov 2023
    -----------
    - 1.16.2 Descriptive rich text content can now be saved (until now it showed up as blank when saved).

    31 Ott 2023
    -----------
    - 1.16.1 You cannot save a menu item without an id anymore.

    15 Ott 2023
    -----------
    - 1.16.0 You can now filter tables in the tables editing section list.
    - 1.15.0 Now table rolls can be outputted in the descriptive rich text content through @@XY macros (see initial content for examples).

    08 Ott 2023
    -----------
    - 1.14.0 An English user manual has been added.

    07 Ott 2023
    -----------
    - 1.13.0 Bookmarks now have names.

    06 Ott 2023
    -----------
    - 1.12.0 New menu system.

    04 Ott 2023
    -----------
    - 1.11.0 Added navigation between peer contents.

    03 Ott 2023
    -----------
    - 1.10.2 Bugfixes (Menu Edit UI).

    02 Ott 2023
    -----------
    - 1.10.1 Tables choice autocomplete must allow choosing the same table multiple times (e.g. NOUN VERB NOUN).

    01 Ott 2023
    -----------
    - 1.10.0 User can now browse content with a tabbed interface.

    27 Sep 2023
    -----------
    - 1.9.1 Small corrections (link colors, table ghost item).

    25 Sep 2023
    -----------
    - 1.9.0 Store / load multiple data files and switch from one to another on the fly.

    24 Sep 2023
    -----------
    - 1.8.0 On content tree UX, tables are now chosen with an autocomplete.

    23 Sep 2023
    -----------
    - 1.7.0 Cut, copy, paste menu items.

    22 Sep 2023
    -----------
    - 1.6.0 Menus can now be rearranged. Small UI improvements.

    20 Sep 2023
    -----------
    - 1.5.2 Improved menu layout.
    - 1.5.1 Additional warning messages and hints.
    - 1.5.0 Import / Export of json data files; import a data file loding the webapp via <dmwhisper url>?datafile=<datafile url>.

    19 Sep 2023
    -----------
    - 1.4.3 Continued work on import/export of data files.
    - 1.4.2 Started work on alternative ways of importing data files (<dmwhisper url>?datafile=<datafile url>).

    18 Sep 2023
    -----------
    - 1.4.1 Fixed ckeditor theme sync, added ckeditor custom build zip for reference.

    16 Sep 2023
    -----------
    - 1.4.0 Added CKEditor for text content editing.

    15 Sep 2023
    -----------
    - 1.3.0 "Information" menu items now accept HTML.

    12 Sep 2023
    -----------
    - 1.2.0 I18N is fully in place.

    10 Sep 2023
    -----------
    - 1.1.0 Menu editing completed.

    06 Sep 2023
    -----------
    - 1.0.9 Table editing completed.

    05 Sep 2023
    -----------
    - 1.0.8 Work started on content authoring; copy content to clipboard added. Refactoring.

    25 Aug 2023
    -----------
    - 1.0.7 Small UI fixes

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
  