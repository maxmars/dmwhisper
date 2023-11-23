import { createSlice } from '@reduxjs/toolkit';
import initialContent from './initialContent';

export const initialState = initialContent;

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
            state.copiedContent = null;
            state.clipboardAction = null;
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

function cryptoRand() {
    const randomBuffer = new Uint32Array(1);
    (window.crypto || window.msCrypto).getRandomValues(randomBuffer);
    return (randomBuffer[0] / (0xffffffff + 1));
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

    const result = Math.floor(cryptoRand() * (max - min + 1)) + min;
    const rng = table.rng.find((rng) => result >= rng.min && result <= rng.max);

    const prefix = rng.prefix ? rng.prefix + " " : "";
    const postfix = rng.postfix ? " " + rng.postfix : "";

    if (rng.table) {
        let tables = rng.table.trim().split(" ");
        
        if (rng.table.indexOf("@@") > -1) {
            tables = tables.map((table) => {
                if (table.startsWith("@@")) {
                    return diceThrow(state, table.substring(2));
                } else {
                    return table;
                }
            });

            tables = tables.join(" ");
        } else {
            tables = tables.map((table) => {
                return diceThrow(state, table);
            });

            tables = tables.join(" ");
        }

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
    setClipboardAction, deleteMenuItem, setTabPath, clearTabPath } = content.actions;