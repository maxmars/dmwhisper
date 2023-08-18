import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    tree: [{
        id: "simple-menu",
        label: "Simple Menu",
        type: "menu",
        data: {
            textContent: "This is a simple menu",
            children: [
                {
                    id: "even-more-nested-menu",
                    label: "Even more nested menu",
                    type: "menu",
                    data: {
                        textContent: "This is a even more nested menu",
                        children: [
                            {
                                id: "regular-description",
                                label: "Regular Description",
                                type: "information",
                                data: {
                                    textContent: "This is a regular description"
                                }
                            }
                        ]
                    },
                },
                {
                    id: "inner-text-content",
                    label: "Simple Inner Text Content",
                    type: "information",
                    data: {
                        textContent: "Please set some meaningful content data, this is just a default stub"
                    }
                },
                {
                    id: "value-based-inner-table",
                    label: "Value based inner table",
                    type: "table",
                    data: {
                        textContent: "This is a value based table",
                        prefix: "This is a prefix",
                        table: "weathersummer weathersummer"
                    }
                }
            ]
        }
    }, {
        id: "text-content",
        label: "Simple Text Content",
        type: "information",
        data: {
            textContent: "Please set some meaningful content data, this is just a default stub"
        }
    },
    {
        id: "value-based-table",
        label: "Value based table",
        type: "table",
        data: {
            textContent: "This is a value based table",
            prefix: "This is a prefix",
            table: "weathersummer weathersummer"
        }
    }],
    tables: [
        {
            id: "weathersummer",
            description: "Weather, summer",
            tags: ["WEATHER", "SUMMER"],
            rng: [
                {
                    min: 1,
                    max: 1,
                    result: "Incredibly cold cold.",
                },
                {
                    min: 2,
                    max: 4,
                    table: "weatherwinter",
                },
                {
                    min: 5,
                    max: 8,
                    prefix: "Looks like winter..",
                    table: "weatherwinter",
                    postfix: " (maybe it's just a cold summer)",
                },
                {
                    min: 9,
                    max: 11,
                    result: "Fuzzy Warm (not really)",
                },
                {
                    min: 12,
                    max: 18,
                    prefix: "And now, for something different..",
                    table: "weatherwinter weathersummer weatherwinter",
                    postfix: " (I don't know what's going on)",
                },
                {
                    min: 19,
                    max: 20,
                    result: "Hot in the city",
                },
            ]
        },
        {
            id: "weatherwinter",
            description: "Weather, winter",
            tags: ["WEATHER", "COLD"],
            rng: [
                {
                    min: 1,
                    max: 1,
                    prefix: "It's: ",
                    result: "BRRR.. Cold.",
                    postfix: "!",
                },
                {
                    min: 2,
                    max: 4,
                    prefix: "It's: ",
                    result: "SO Cold",
                    postfix: "!",
                },
                {
                    min: 5,
                    max: 8,
                    prefix: "It's: ",
                    result: "This cold's not fair",
                    postfix: "!",
                },
                {
                    min: 9,
                    max: 11,
                    prefix: "It's: ",
                    result: "Cold as ice",
                    postfix: "!",
                },
                {
                    min: 12,
                    max: 18,
                    prefix: "It's: ",
                    result: "Arguably cold",
                    postfix: "!",
                },
                {
                    min: 19,
                    max: 20,
                    prefix: "It's: ",
                    result: "Not warm at all",
                    postfix: "!",
                },
            ]
        },
    ]
};

// ==============================|| SLICE - THROWS ||============================== //

const content = createSlice({
    name: 'content',
    initialState,
    reducers: {
        setContent(state, action) {
            const { tree, tables } = action.payload;

            state.tree = tree;
            state.tables = tables;
        },
        clearContent(state, action) {
            state.tree = initialState.tree;
            state.tables = initialState.tables;
        },
    }
});

// Path is in the form of "id1.id2.id3"
export const getContent = (state, path) => {

    if (path === undefined || path === null || path === "") {
        return state;
    }

    const pathArray = path.split(".");

    let content = state;
    for (let i = 0; i < pathArray.length; i++) {
        content = content.find(item => item.id === pathArray[i]).data.children;
    }
    return content;
}

export const getContentName = (state, path) => {

    if (path === undefined || path === null || path === "") {
        return "Home menu";
    }

    const pathArray = path.split(".");

    let content = state;
    let contentName = "";
    for (let i = 0; i < pathArray.length; i++) {
        const nodo = content.find(item => item.id === pathArray[i]);
        content = nodo.data.children;
        contentName = nodo.label;
    }
    return contentName;
}

export const diceThrow = (state, idTabella) => {

    if (idTabella.indexOf(" ") > -1) {
        let tables = idTabella.split(" ");

        tables = tables.map((table) => {
            return diceThrow(state, table);
        });

        tables = tables.join(" ");

        return tables;
    }    

    const tabella = state.tables.find((tabella) => tabella.id === idTabella);
    let min = 1000;
    let max = 0;

    tabella.rng.forEach((rng) => {
        if (rng.min < min) {
            min = rng.min;
        }

        if (rng.max > max) {
            max = rng.max;
        }
    });

    const result = Math.floor(Math.random() * (max - min + 1)) + min;
    const rng = tabella.rng.find((rng) => result >= rng.min && result <= rng.max);

    const prefix = rng.prefix ? rng.prefix + " " : "";
    const postfix = rng.postfix ? " " + rng.postfix : "";

    if (rng.table) {
        let tables = rng.table.split(" ");

        tables = tables.map((table) => {
            return diceThrow(state, table);
        });

        tables = tables.join(" ");

        return prefix + tables + postfix;
    } else {
        return prefix + rng.result + postfix;
    }
}



export default content.reducer;

export const { setContent, clearContent } = content.actions;