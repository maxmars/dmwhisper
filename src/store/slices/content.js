import { createSlice } from '@reduxjs/toolkit';
import initialContent from './initialContent';
import { padLeft } from '../../utils';

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
            const { tree, tables, setpieces } = action.payload;

            state.tree = tree;
            state.tables = tables;
            state.setpieces = setpieces;
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
        addDungeonMonster(state, action) {
            const newItem = action.payload;

            if (!state.dungeonMonsters) {
                state.dungeonMonsters = [];
            }

            state.dungeonMonsters.push(newItem);
        },
        addDungeonTreasures(state, action) {
            const newItem = action.payload;

            if (!state.dungeonTreasures) {
                state.dungeonTreasures = [];
            }

            state.dungeonTreasures.push(newItem);
        },
        addDungeonTraps(state, action) {
            const newItem = action.payload;

            if (!state.dungeonTraps) {
                state.dungeonTraps = [];
            }

            state.dungeonTraps.push(newItem);
        },
        addDungeonSetpieces(state, action) {
            const newItem = action.payload;

            if (!state.dungeonSietpieces) {
                state.dungeonSietpieces = [];
            }

            state.dungeonSietpieces.push(newItem);
        },
        addDungeonPuzzles(state, action) {
            const newItem = action.payload;

            if (!state.dungeonPuzzles) {
                state.dungeonPuzzles = [];
            }

            state.dungeonPuzzles.push(newItem);
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
        removeDungeonMonsters(state, action) {
            const dungeonMonsterId = action.payload;

            if (!state.dungeonMonsters) {
                state.dungeonMonsters = [];
                return;
            }

            state.dungeonMonsters = state.dungeonMonsters.filter((dungeonMonster) => dungeonMonster.id !== dungeonMonsterId);
        },
        removeDungeonTreasures(state, action) {
            const dungeonTreasureId = action.payload;

            if (!state.dungeonTreasures) {
                state.dungeonTreasures = [];
                return;
            }

            state.dungeonTreasures = state.dungeonTreasures.filter((dungeonTreasure) => dungeonTreasure.id !== dungeonTreasureId);
        },
        removeDungeonTrap(state, action) {
            const dungeonTrapId = action.payload;

            if (!state.dungeonTraps) {
                state.dungeonTraps = [];
                return;
            }

            state.dungeonTraps = state.dungeonTraps.filter((dungeonTrap) => dungeonTrap.id !== dungeonTrapId);
        },
        removeDungeonSetpiece(state, action) {
            const dungeonSetpieceId = action.payload;

            if (!state.dungeonSetpieces) {
                state.dungeonSetpieces = [];
                return;
            }

            state.dungeonSetpieces = state.dungeonSetpieces.filter((dungeonSetpiece) => dungeonSetpiece.id !== dungeonSetpieceId);
        },
        removeDungeonPuzzles(state, action) {
            const dungeonPuzzleId = action.payload;

            if (!state.dungeonPuzzles) {
                state.dungeonPuzzles = [];
                return;
            }

            state.dungeonPuzzles = state.dungeonPuzzles.filter((dungeonPuzzle) => dungeonPuzzle.id !== dungeonPuzzleId);
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
        updateDungeonMonsterHeader(state, action) {
            const { originalDungeonMonsterId, dungeonMonsterId, dungeonMonsterDescription } = action.payload;

            if (!state.dungeonMonsters) {
                console.log("No dungeon Monsters to update");
                return;
            }

            const dungeonMonster = state.dungeonMonsters.find((dungeonMonster) => dungeonMonster.id === originalDungeonMonsterId);
            const dungeonMonsters = state.dungeonMonsters.filter((dungeonMonster) => dungeonMonster.id !== originalDungeonMonsterId);

            dungeonMonster.id = dungeonMonsterId;
            dungeonMonster.description = dungeonMonsterDescription;
            dungeonMonsters.push(dungeonMonster);

            state.dungeonMonsters = dungeonMonsters;
        },
        updateDungeonTreasureHeader(state, action) {
            const { originalDungeonTreasureId, dungeonTreasureId, dungeonTreasureDescription } = action.payload;

            if (!state.dungeonTreasures) {
                console.log("No dungeon treasures to update");
                return;
            }

            const dungeonTreasure = state.dungeonTreasures.find((dungeonTreasure) => dungeonTreasure.id === originalDungeonTreasureId);
            const dungeonTreasures = state.dungeonTreasures.filter((dungeonTreasure) => dungeonTreasure.id !== originalDungeonTreasureId);

            dungeonTreasure.id = dungeonTreasureId;
            dungeonTreasure.description = dungeonTreasureDescription;
            dungeonTreasures.push(dungeonTreasure);

            state.dungeonTreasures = dungeonTreasures;
        },
        updateDungeonTrapHeader(state, action) {
            const { originalDungeonTrapId, dungeonTrapId, dungeonTrapDescription } = action.payload;

            if (!state.dungeonTraps) {
                console.log("No dungeon traps to update");
                return;
            }

            const dungeonTrap = state.dungeonTraps.find((dungeonTrap) => dungeonTrap.id === originalDungeonTrapId);
            const dungeonTraps = state.dungeonTraps.filter((dungeonTrap) => dungeonTrap.id !== originalDungeonTrapId);

            dungeonTrap.id = dungeonTrapId;
            dungeonTrap.description = dungeonTrapDescription;
            dungeonTraps.push(dungeonTrap);

            state.dungeonTraps = dungeonTraps;
        },
        updateDungeonSetpieceHeader(state, action) {
            const { originalDungeonSetpieceId, dungeonSetpieceId, dungeonSetpieceDescription } = action.payload;

            if (!state.dungeonSetpieces) {
                console.log("No dungeon setpieces to update");
                return;
            }

            const dungeonSetpiece = state.dungeonSetpieces.find((setpiece) => setpiece.id === originalDungeonSetpieceId);
            const dungeonSetpieces = state.dungeonSetpieces.filter((setpiece) => setpiece.id !== originalDungeonSetpieceId);

            dungeonSetpiece.id = dungeonSetpieceId;
            dungeonSetpiece.description = dungeonSetpieceDescription;
            dungeonSetpieces.push(dungeonSetpiece);

            state.dungeonSetpieces = dungeonSetpieces;
        },
        updateDungeonPuzzleHeader(state, action) {
            const { originalDungeonPuzzleId, dungeonPuzzleId, dungeonPuzzleDescription } = action.payload;

            if (!state.dungeonPuzzles) {
                console.log("No dungeon puzzles to update");
                return;
            }

            const dungeonPuzzle = state.dungeonPuzzles.find((dungeonPuzzle) => dungeonPuzzle.id === originalDungeonPuzzleId);
            const dungeonPuzzles = state.dungeonPuzzles.filter((dungeonPuzzle) => dungeonPuzzle.id !== originalDungeonPuzzleId);

            dungeonPuzzle.id = dungeonPuzzleId;
            dungeonPuzzle.description = dungeonPuzzleDescription;
            dungeonPuzzles.push(dungeonPuzzle);

            state.dungeonPuzzles = dungeonPuzzles;
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
        updateDungeonMonsterItem(state, action) {
            const { dungeonMonsterId, item } = action.payload;

            if (!state.dungeonMonsters) {
                console.log("No dungeon monsters to update");
                return;
            }

            const dungeonMonster = state.dungeonMonsters.find((dungeonMonster) => dungeonMonster.id === dungeonMonsterId);
            const dungeonMonsters = state.dungeonMonsters.filter((dungeonMonster) => dungeonMonster.id !== dungeonMonsterId);

            dungeonMonster.rng = item;
            dungeonMonsters.push(dungeonMonsters);

            state.dungeonMonsters = dungeonMonsters;
        },
        updateDungeonTreasureItem(state, action) {
            const { dungeonTreasureId, item } = action.payload;

            if (!state.dungeonTreasures) {
                console.log("No dungeon treasures to update");
                return;
            }

            const dungeonTreasure = state.dungeonTreasures.find((dungeonTreasure) => dungeonTreasure.id === dungeonTreasureId);
            const dungeonTreasures = state.dungeonTreasures.filter((dungeonTreasure) => dungeonTreasure.id !== dungeonTreasureId);

            dungeonTreasure.rng = item;
            dungeonTreasures.push(dungeonTreasure);

            state.dungeonTreasures = dungeonTreasures;
        },
        updateDungeonTrapItem(state, action) {
            const { dungeonTrapId, item } = action.payload;

            if (!state.dungeonTraps) {
                console.log("No dungeon traps to update");
                return;
            }

            const dungeonTrap = state.dungeonTraps.find((dungeonTrap) => dungeonTrap.id === dungeonTrapId);
            const dungeonTraps = state.dungeonTraps.filter((dungeonTrap) => dungeonTrap.id !== dungeonTrapId);

            dungeonTrap.rng = item;
            dungeonTraps.push(dungeonTrap);

            state.dungeonTraps = dungeonTraps;
        },
        updateDungeonSetpieceItem(state, action) {
            const { dungeonSetpieceId, item } = action.payload;

            if (!state.dungeonSetpieces) {
                console.log("No dungeon setpieces to update");
                return;
            }

            const dungeonSetpiece = state.dungeonSetpieces.find((dungeonSetpiece) => dungeonSetpiece.id === dungeonSetpieceId);
            const dungeonSetpieces = state.dungeonSetpieces.filter((dungeonSetpiece) => dungeonSetpiece.id !== dungeonSetpieceId);

            dungeonSetpiece.rng = item;
            dungeonSetpieces.push(dungeonSetpiece);

            state.dungeonSetpieces = dungeonSetpieces;
        },
        updateDungeonPuzzleItem(state, action) {
            const { dungeonPuzzleId, item } = action.payload;

            if (!state.dungeonPuzzles) {
                console.log("No dungeon puzzles to update");
                return;
            }

            const dungeonPuzzle = state.dungeonPuzzles.find((dungeonPuzzle) => dungeonPuzzle.id === dungeonPuzzleId);
            const dungeonPuzzles = state.dungeonPuzzles.filter((dungeonPuzzle) => dungeonPuzzle.id !== dungeonPuzzleId);

            dungeonPuzzle.rng = item;
            dungeonPuzzles.push(dungeonPuzzle);

            state.dungeonPuzzles = dungeonPuzzles;
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

            if (content.type === "map") {
                content.data.map = updatedContentHeader.map;
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

            if (content.type === "map") {
                content.data.map = { density: 2, gridsize: 2, setpieceId: "" };
            } else {
                delete content.data.map;
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
export const getRng = (item, minval, maxval) => {
    let min = 1000;
    let max = 0;

    item.rng.forEach((rng) => {
        if (rng.min < min) {
            min = rng.min;
        }

        if (rng.max > max) {
            max = rng.max;
        }
    });

    if (minval && maxval) {
        if (minval >= min && minval <= max) {
            min = minval;
        }

        if (maxval >= min && maxval <= max) {
            max = maxval;
        }
    }

    const result = Math.floor(globalRandomValues.pop() * (max - min + 1)) + min;
    return item.rng.find((rng) => result >= rng.min && result <= rng.max);

}

export const mergeContentAndTables = (content, tables, state, minDieValue, maxDieValue) => {

    const tableDictionary = {};
    tables.forEach((table, index) => {
        if (table.endsWith("!")) {
            tableDictionary[table.replace("!", "")] = [];
        }
    });

    tables = tables.map((table) => {
        return getUniqueValue(state, table.replace("!", ""), tableDictionary, minDieValue, maxDieValue);
    });

    let htmlContent = content;
    tables.forEach((table, index) => {
        htmlContent = htmlContent.replace(new RegExp("@@" + padLeft(index + 1, 2), 'g'), table);
    });

    return rollAndReplace(htmlContent)
}

export const diceThrow = (state, idTable, tableDictionary, minval, maxval) => {

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
        const rng = getRng(table, minval, maxval);
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


export const getUniqueValue = (state, table, tableDictionary, minDieValue, maxDieValue) => {
    let result = diceThrow(state, table, tableDictionary, minDieValue, maxDieValue);
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

// Supported formats: {{XdY+Z}}, {{XdY-Z}}, {{XdY}
export const rollAndReplace = (textContent) => {
    const getDiceThrowResult = (X, Y, Z) => {
        let result = 0;
        for (let i = 0; i < X; i++) {
            result += Math.floor(Math.random() * Y) + 1;
        }
        return result + Z;
    };

    const regexCount = (str, regex) => {
        const matches = str.match(regex);
        return matches ? matches.length : 0;
    };

    const count = regexCount(textContent, /{{(\d+)d(\d+)\+(\d+)}}/g) +
        regexCount(textContent, /{{(\d+)d(\d+)-(\d+)}}/g) +
        regexCount(textContent, /{{(\d+)d(\d+)}}/g);

    if (count > 0) {

        let regex = /{{(\d+)d(\d+)\+(\d+)}}/g;
        textContent = textContent.replace(regex, (match, X, Y, Z) => {
            return getDiceThrowResult(X, Y, parseInt(Z));
        });

        regex = /{{(\d+)d(\d+)-(\d+)}}/g;
        textContent = textContent.replace(regex, (match, X, Y, Z) => {
            return getDiceThrowResult(X, Y, parseInt(Z) * -1);
        });

        regex = /{{(\d+)d(\d+)}}/g;
        textContent = textContent.replace(regex, (match, X, Y) => {
            return getDiceThrowResult(X, Y, 0);
        });

    };

    return textContent;
}


export const shuffleArray = (originalArray) => {
    const array = [...originalArray];
    
    for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index
      const j = Math.floor(Math.random() * (i + 1));
      // Swap elements at indices i and j
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

export default content.reducer;

export const { setContent, clearContent, setLastTableContent, addTable, addSetpiece, removeTable, removeSetpiece, updateTableHeader,
    updateSetpieceHeader, updateTableRng, updateSetpieceRng, updateContent, updateContentHeader, addMenuItem, updateContentType,
    setClipboardAction, deleteMenuItem, setTabPath, clearTabPath } = content.actions;