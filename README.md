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

## The "tables" object
