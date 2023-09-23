import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    tree: [{
        id: "farm",
        label: "A farm just out of the town",
        type: "menu",
        data: {
            textContent: "The farm just out of the town",
            children: [
                {
                    id: "farm-description",
                    label: "A description of the farm",
                    type: "information",
                    data: {
                        textContent: "The farm is located between the city gates, the forest and the wizard's castle, which is located on the hill.<br />The farm is run by an old farmer and his wife, who have a 10 year old son.<br />The farm is surrounded by a stone wall, with a wooden gate.<br />The house is a wooden construction with a thatched roof.<br />The farm has a small vegetable garden, a chicken coop, a sheep pen and a pig pen. The farm also has a water well.<br /><h1>By the way you can use HTML tags in this kind of content (this is H1)</h1>"
                    }
                },
                {
                    id: "events-farm",
                    label: "The events around the farm",
                    type: "table",
                    data: {
                        textContent: "Events around the farm",
                        table: "farm-events"
                    },
                },
                {
                    id: "npc-farm",
                    label: "The NPCs encountered at the farm",
                    type: "table",
                    data: {
                        textContent: "NPC near the farm",
                        table: "farm-npc"
                    },
                },
                {
                    id: "weather-farm",
                    label: "The weather around the farm",
                    type: "table",
                    data: {
                        textContent: "Typical farm weather conditions",
                        table: "farm-weather"
                    },
                },
            ]
        }
    },
    {
        id: "explanation",
        label: "Explanation of the example tables",
        type: "information",
        data: {
            textContent: "The data herein is only an example.<br />The other item in this menu is an example of a sub-menu.<br />Inside of it there are three tables: the farm weather is a table of values only; farm NPCs is a table that has some values and others are taken from two other tables (NPC from Castle and NPC from Town).<br />The last table is that of the farm events: in it there are values, references to the farm animals table and references to the farm NPC table which, as seen before, in turn contains references to other tables.<br /><h1>By the way you can use HTML tags in this kind of content (this is H1)</h1>",
        }
    }
    ],
    tables: [
        {
            id: "farm-events",
            description: "Farm Events",
            tags: ["events", "farm"],
            rng: [
                {
                    min: 1,
                    max: 2,
                    result: "A sound of heavy footsteps in the woods",
                },
                {
                    min: 3,
                    max: 4,
                    result: "A group of Goblins approaching",
                },
                {
                    min: 5,
                    max: 8,
                    prefix: "NPC encounter: ",
                    table: "farm-npc",
                },
                {
                    min: 9,
                    max: 11,
                    prefix: "You meet an animal: ",
                    table: "farm-animals",
                },
                {
                    min: 12,
                    max: 12,
                    prefix: "Weather is changing: ",
                    table: "farm-weather",
                },
                {
                    min: 13,
                    max: 15,
                    result: "A hum of insects coming from the woods",
                },
                {
                    min: 16,
                    max: 17,
                    result: "A whirlwind that kicks up the dust",
                },
                {
                    min: 18,
                    max: 18,
                    result: "A dull thud coming from the woods",
                },
                {
                    min: 19,
                    max: 20,
                    prefix: "Weather is changing: ",
                    table: "farm-weather",
                },
            ]
        },
        {
            id: "farm-weather",
            description: "Weather around the farm",
            tags: ["weather", "farm"],
            rng: [
                {
                    min: 1,
                    max: 1,
                    result: "Cold and foggy",
                },
                {
                    min: 2,
                    max: 4,
                    result: "Cool",
                },
                {
                    min: 5,
                    max: 8,
                    result: "Wind and rain",
                },
                {
                    min: 9,
                    max: 11,
                    result: "Warm and sunny",
                },
                {
                    min: 12,
                    max: 18,
                    result: "Temperate and variable",
                },
                {
                    min: 19,
                    max: 20,
                    result: "Unbearable heat",
                },
            ]
        },
        {
            id: "farm-animals",
            description: "Animals around the farm",
            tags: ["animals", "farm"],
            rng: [
                {
                    min: 1,
                    max: 1,
                    result: "A lone wolf, out of the woods",
                },
                {
                    min: 2,
                    max: 4,
                    result: "A stray cat purring around your legs",
                },
                {
                    min: 5,
                    max: 8,
                    result: "One of the farm dogs, barking at you",
                },
                {
                    min: 9,
                    max: 11,
                    result: "A group of sheep, looking at you curiously",
                },
                {
                    min: 12,
                    max: 18,
                    result: "Hens squawking and chasing each other",
                },
                {
                    min: 19,
                    max: 20,
                    result: "Castle hunting dogs, chasing a rabbit",
                },
            ]
        },
        {
            id: "farm-npc",
            description: "NPCs around the farm",
            tags: ["npc", "farm"],
            rng: [
                {
                    min: 1,
                    max: 1,
                    result: "Marius the farmer, leaning on his shovel",
                },
                {
                    min: 2,
                    max: 4,
                    prefix: "From the castle.. ",
                    table: "castle-npc",
                },
                {
                    min: 5,
                    max: 8,
                    result: "Marius the farmer, harvesting potatoes",
                },
                {
                    min: 9,
                    max: 11,
                    result: "Evelina the peasant woman who cleans the farmyard",
                },
                {
                    min: 12,
                    max: 16,
                    result: "Raimondo the little rascal, who makes faces",
                },
                {
                    min: 17,
                    max: 20,
                    prefix: "From the city.. ",
                    table: "city-npc",
                },
            ]
        },
        {
            id: "castle-npc",
            description: "NPCs around the castle",
            tags: ["npc", "castle"],
            rng: [
                {
                    min: 1,
                    max: 1,
                    result: "The wizard, who looks at you curiously",
                },
                {
                    min: 2,
                    max: 4,
                    result: "Battista the butler, who looks at you suspiciously",
                },
                {
                    min: 5,
                    max: 8,
                    result: "Maria the cook, who looks at you distractedly",
                },
                {
                    min: 9,
                    max: 11,
                    result: "The castle gamekeeper",
                },
                {
                    min: 12,
                    max: 18,
                    result: "Two students of magic, disciples of the castle wizard",
                },
                {
                    min: 19,
                    max: 20,
                    result: "The wizard of the castle looking out of breath",
                },
            ]
        },
        {
            id: "city-npc",
            description: "NPCs around the city",
            tags: ["npc", "city"],
            rng: [
                {
                    min: 1,
                    max: 1,
                    result: "The mayor's wife",
                },
                {
                    min: 2,
                    max: 4,
                    result: "The mayor",
                },
                {
                    min: 5,
                    max: 8,
                    result: "A market trader",
                },
                {
                    min: 9,
                    max: 11,
                    result: "Two city guards",
                },
                {
                    min: 12,
                    max: 18,
                    result: "A citizen who looks at you with curiosity",
                },
                {
                    min: 19,
                    max: 20,
                    result: "A schoolgirl from the city",
                },
            ]
        },
    ],
    copiedContent: null, // contains the path to copy
    clipboardAction: null, // can be null, "copy" or "cut"
};


// ==============================|| SLICE - THROWS ||============================== //

const content = createSlice({
    name: 'content',
    initialState,
    reducers: {
        setClipboardAction(state, action) {
            const { copiedContent, clipboardAction } = action.payload;

            if (clipboardAction === "clear") {
                state.copiedContent = null;
                state.clipboardAction = null;
            } else {
                state.copiedContent = copiedContent;
                state.clipboardAction = clipboardAction;
            }
        },
        setContent(state, action) {
            const { tree, tables } = action.payload;

            state.tree = tree;
            state.tables = tables;
        },
        clearContent(state, action) {
            state.tree = initialState.tree;
            state.tables = initialState.tables;
        },
        addTable(state, action) {
            const newTable = action.payload;

            state.tables.push(newTable);
        },
        removeTable(state, action) {
            const tableId = action.payload;

            state.tables = state.tables.filter((table) => table.id !== tableId);
        },
        updateTableHeader(state, action) {
            const { originalTableId, tableId, tableDescription } = action.payload;

            const table = state.tables.find((table) => table.id === originalTableId);
            const tables = state.tables.filter((table) => table.id !== originalTableId);

            table.id = tableId;
            table.description = tableDescription;
            tables.push(table);

            state.tables = tables;
        },
        updateTableRng(state, action) {
            const { tableId, rng } = action.payload;

            const table = state.tables.find((table) => table.id === tableId);
            const tables = state.tables.filter((table) => table.id !== tableId);

            table.rng = rng;
            tables.push(table);

            state.tables = tables;
        },
        addMenuItem(state, action) {
            try {
            const { newMenuItem, path } = action.payload;

            if (path === undefined || path === null || path === "") {
                state.tree = state.tree.filter((item) => item.id !== newMenuItem.id);
                state.tree.push(newMenuItem);
            } else {

                const pathArray = path.split(".");

                let content = state.tree;
                for (let i = 0; i < pathArray.length - 1; i++) {
                    content = content.find(item => item.id === pathArray[i]).data.children;
                }

                content = content.find(item => item.id === pathArray[pathArray.length - 1]).data;
                if (content.children) {
                    content.children = content.children.filter((item) => item.id !== newMenuItem.id);
                    content.children.push(newMenuItem);
                } else {
                    content.children = [];
                    content.children.push(newMenuItem);
                }
            }
            } catch (e) {
                console.log(e);
            }
        },
        deleteMenuItem(state, action) {
            const { path } = action.payload;

            if (path === undefined || path === null || path === "") {
                return;
            }

            const pathArray = path.split(".");

            if (pathArray.length === 1) {
                state.tree = state.tree.filter((item) => item.id !== pathArray[0]);
                return;
            }

            let content = state.tree;
            for (let i = 0; i < pathArray.length - 2; i++) {
                content = content.find(item => item.id === pathArray[i]).data.children;
            }

            content = content.find(item => item.id === pathArray[pathArray.length - 2]).data;
            if (content.children) {
                content.children = content.children.filter((item) => item.id !== pathArray[pathArray.length - 1]);
            }
        },
        updateContent(state, action) {
            const { updatedContent, path } = action.payload;

            if (path === undefined || path === null || path === "") {
                state.tree = updatedContent;
                return;
            }

            const pathArray = path.split(".");

            let content = state.tree;
            for (let i = 0; i < pathArray.length - 1; i++) {
                content = content.find(item => item.id === pathArray[i]).data.children;
            }

            content = content.find(item => item.id === pathArray[pathArray.length - 1]).data;
            content.children = updatedContent;
        },
        updateContentHeader(state, action) {
            const { updatedContentHeader, path } = action.payload;

            if (path === undefined || path === null || path === "") {
                return;
            }

            const pathArray = path.split(".");

            let content = state.tree;
            for (let i = 0; i < pathArray.length - 1; i++) {
                content = content.find(item => item.id === pathArray[i]).data.children;
            }

            content = content.find(item => item.id === pathArray[pathArray.length - 1]);

            content.id = updatedContentHeader.id;
            content.label = updatedContentHeader.label;
            content.type = updatedContentHeader.type;
            content.data.textContent = updatedContentHeader.textContent;

            if (content.type === "table") {
                content.data.table = updatedContentHeader.table;
            }

            if (content.type === "menu") {
                if (!(content.data.children)) {
                    content.data.children = [];
                }
            } else {
                delete content.data.children;
            }
        },
        updateContentType(state, action) {
            const { updatedContentType, path } = action.payload;

            if (path === undefined || path === null || path === "") {
                return;
            }

            const pathArray = path.split(".");

            let content = state.tree;
            for (let i = 0; i < pathArray.length - 1; i++) {
                content = content.find(item => item.id === pathArray[i]).data.children;
            }

            content = content.find(item => item.id === pathArray[pathArray.length - 1]);

            content.type = updatedContentType;

            if (content.type === "table") {
                content.data.table = "";
            } else {
                delete content.data.table;
            }

            if (content.type === "menu") {
                if (!(content.data.children)) {
                    content.data.children = [];
                }
            } else {
                delete content.data.children;
            }
        }

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

export const getContentMetaData = (state, path) => {

    if (path === undefined || path === null || path === "") {
        return state;
    }

    const pathArray = path.split(".");

    let content = state;
    for (let i = 0; i < pathArray.length - 1; i++) {
        content = content.find(item => item.id === pathArray[i]).data.children;
    }
    content = content.find(item => item.id === pathArray[pathArray.length - 1])
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

export const diceThrow = (state, idTable) => {

    if (idTable.indexOf(" ") > -1) {
        let tables = idTable.split(" ");

        tables = tables.map((table) => {
            return diceThrow(state, table);
        });

        tables = tables.join(" ");

        return tables;
    }

    const table = state.tables.find((table) => table.id === idTable);
    let min = 1000;
    let max = 0;

    table.rng.forEach((rng) => {
        if (rng.min < min) {
            min = rng.min;
        }

        if (rng.max > max) {
            max = rng.max;
        }
    });

    const result = Math.floor(Math.random() * (max - min + 1)) + min;
    const rng = table.rng.find((rng) => result >= rng.min && result <= rng.max);

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


export const getTable = (state, idTable) => {

    if (idTable.indexOf(" ") > -1) {
        return "Multiple tables aren't supported for consultation (" + idTable + ").";
    }

    const table = state.tables.find((table) => table.id === idTable);

    if (table) {
        return table;
    } else {
        return "No such table: " + idTable;
    }
}



export default content.reducer;

export const { setContent, clearContent, addTable, removeTable, updateTableHeader,
    updateTableRng, updateContent, updateContentHeader, addMenuItem, updateContentType,
    setClipboardAction, deleteMenuItem } = content.actions;