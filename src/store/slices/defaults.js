import { createSlice } from '@reduxjs/toolkit';

// types
const initialState = {
    tablesFilter: "",
    setpiecesFilter: "",
    dungeonTrapSetsFilter: "",
    dungeonMonstersFilter: "",
    dungeonSetpiecesFilter: "",
    dungeonTreasuresFilter: "",
    dungeonPuzzlesFilter: "",
};

// ==============================|| SLICE - THROWS ||============================== //

const defaults = createSlice({
    name: 'defaults',
    initialState,
    reducers: {
        setTablesFilter(state, action) {
            const filter = action.payload;

            state.tablesFilter = filter;
        },
        setSetpiecesFilter(state, action) {
            const filter = action.payload;

            state.setpiecesFilter = filter;
        },
        setDungeonTrapSetsFilter(state, action) {
            const filter = action.payload;

            state.dungeonTrapSetsFilter = filter;
        },
        setDungeonMonstersFilter(state, action) {
            const filter = action.payload;

            state.dungeonMonstersFilter = filter;
        },
        setDungeonSetpiecesFilter(state, action) {
            const filter = action.payload;

            state.dungeonSetpiecesFilter = filter;
        },
        setDungeonTreasuresFilter(state, action) {
            const filter = action.payload;

            state.dungeonTreasuressFilter = filter;
        },
        setDungeonPuzzlesFilter(state, action) {
            const filter = action.payload;

            state.dungeonPuzzlesFilter = filter;
        },
    }
});

export default defaults.reducer;

export const { setTablesFilter, setSetpiecesFilter, setDungeonTrapSetsFilter,
    setDungeonMonstersFilter, setDungeonSetpiecesFilter, setDungeonTreasuresFilter,
    setDungeonPuzzlesFilter
 } = defaults.actions;
