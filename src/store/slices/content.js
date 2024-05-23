import { createSlice } from '@reduxjs/toolkit';
import initialContent from './initialContent';

export const initialState = { ...initialContent, lastTableContent: {} };

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
            state.setpieces = initialState.setpieces;
            state.copiedContent = null;
            state.clipboardAction = null;
        },
        clearContent(state, action) {
            state.tree = initialState.tree;
            state.tables = initialState.tables;
            state.setpieces = initialState.setpieces;
        },
        setLastTableContent(state, action) {
            const { contentId, diceThrow, htmlContent } = action.payload;

            try {
                if (!state.lastTableContent) {
                    state.lastTableContent = {};
                }

                const cleanedId = contentId.replace(/[^0-9a-zA-Z]/g, '');

                state.lastTableContent[cleanedId] = {
                    diceThrow: diceThrow,
                    htmlContent: htmlContent
                };
            } catch (e) {
                console.log(e);
            }
        },
        addTable(state, action) {
            const newTable = action.payload;

            state.tables.push(newTable);
        },
        addSetpiece(state, action) {
            const newSetpiece = action.payload;

            if (!state.setpieces) {
                state.setpieces = [];
            }

            state.setpieces.push(newSetpiece);
        },
        removeTable(state, action) {
            const tableId = action.payload;

            state.tables = state.tables.filter((table) => table.id !== tableId);
        },
        removeSetpiece(state, action) {
            const setpieceId = action.payload;

            if (!state.setpieces) {
                state.setpieces = [];
                return;
            }

            state.setpieces = state.setpieces.filter((setpiece) => setpiece.id !== setpieceId);
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
        updateSetpieceHeader(state, action) {
            const { originalSetpieceId, setpieceId, setpieceDescription } = action.payload;

            if (!state.setpieces) {
                console.log("No setpieces to update");
                return;
            }

            const setpiece = state.setpieces.find((setpiece) => setpiece.id === originalSetpieceId);
            const setpieces = state.setpieces.filter((setpiece) => setpiece.id !== originalSetpieceId);

            setpiece.id = setpieceId;
            setpiece.description = setpieceDescription;
            setpieces.push(setpiece);

            state.setpieces = setpieces;
        },
        updateTableRng(state, action) {
            const { tableId, rng } = action.payload;

            const table = state.tables.find((table) => table.id === tableId);
            const tables = state.tables.filter((table) => table.id !== tableId);

            table.rng = rng;
            tables.push(table);

            state.tables = tables;
        },
        updateSetpieceRng(state, action) {
            const { setpieceId, rng } = action.payload;

            if (!state.setpieces) {
                console.log("No setpieces to update");
                return;
            }

            const setpiece = state.setpieces.find((setpiece) => setpiece.id === setpieceId);
            const setpieces = state.setpieces.filter((setpiece) => setpiece.id !== setpieceId);

            setpiece.rng = rng;
            setpieces.push(setpiece);

            state.setpieces = setpieces;
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
        },
        setTabPath(state, action) {
            const { tab, path } = action.payload;

            if (!state.tabPaths) {
                state.tabPaths = ["", "", "", "", ""];
            }

            state.tabPaths[tab] = path;
        },
        clearTabPath(state, action) {
            state.tabPaths = ["", "", "", "", ""];
        }
    }
});

// Path is in the form of "id1.id2.id3"
export const getContent = (state, path) => {

    try {
        if (path === undefined || path === null || path === "") {
            return state;
        }

        const pathArray = path.split(".");

        let content = state;
        for (let i = 0; i < pathArray.length; i++) {
            content = content.find(item => item.id === pathArray[i]).data.children;
        }
        return content;
    } catch (e) {
        return null;
    }
}

export const getContentMetaData = (state, path) => {

    try {
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
    } catch (e) {
        return null;
    }
}

export const getContentName = (state, path) => {

    try {
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
    } catch (e) {
        return null;
    }
}

function cryptoRands() {
    let randomBuffer = new Uint32Array(5000);
    window.crypto.getRandomValues(randomBuffer);

    const randomFloatBuffer = Array.from(randomBuffer).map((value) => {
        return value / (0xffffffff + 1);
    });

    return randomFloatBuffer;
}

let globalRandomValues = cryptoRands();
export const diceThrow = (state, idTable, tableDictionary) => {

    try {
        if (globalRandomValues.length < 1) {
            globalRandomValues = cryptoRands();
        }

        // If the table is a list of tables, we need to get a value for each one
        if (idTable.indexOf(" ") > -1) {
            let tables = idTable.split(" ");

            tables = tables.map((table) => {
                return getUniqueValue(state, table, tableDictionary);
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

        const result = Math.floor(globalRandomValues.pop() * (max - min + 1)) + min;

        const rng = table.rng.find((rng) => result >= rng.min && result <= rng.max);

        const prefix = rng.prefix ? rng.prefix + " " : "";
        const postfix = rng.postfix ? " " + rng.postfix : "";

        if (rng.table) {
            // The result contains sub-tables, we need to get a value for each one
            let tables = rng.table.trim().split(" ");

            if (rng.table.indexOf("@@") > -1) {
                tables = tables.map((table) => {
                    if (table.startsWith("@@")) {

                        table = table.substring(2)
                        return getUniqueValue(state, table, tableDictionary);
                    } else {
                        return table;
                    }
                });

                tables = tables.join(" ");
            } else {
                tables = tables.map((table) => {
                    return getUniqueValue(state, table, tableDictionary);
                });

                tables = tables.join(" ");
            }

            return prefix + tables + postfix;
        } else {
            // The result is a simple string
            return prefix + rng.result + postfix;
        }
    } catch (e) {
        return "Error!";
    }
}


export const getUniqueValue = (state, table, tableDictionary) => {
    let result = diceThrow(state, table, tableDictionary);
    if (tableDictionary[table]) {
        if (tableDictionary[table].indexOf(result) > -1) {
            let tries = 0;

            do {
                result = diceThrow(state, table, tableDictionary);
                tries++;
            } while (tableDictionary[table].indexOf(result) > -1 && tries < 1000);

            if (tableDictionary[table].indexOf(result) === -1) {
                tableDictionary[table].push(result);
            }
        } else {
            tableDictionary[table].push(result);
        }
    }

    return result;
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

export const { setContent, clearContent, setLastTableContent, addTable, addSetpiece, removeTable, removeSetpiece, updateTableHeader,
    updateSetpieceHeader, updateTableRng, updateSetpieceRng, updateContent, updateContentHeader, addMenuItem, updateContentType,
    setClipboardAction, deleteMenuItem, setTabPath, clearTabPath } = content.actions;