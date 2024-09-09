import { createSlice } from '@reduxjs/toolkit';

// types
const initialState = {
    tablesFilter: "",
    setpiecesFilter: "",
    dungeonTrapSetsFilter: "",
    dungeonMonsterSetsFilter: "",
    dungeonSetpiecesFilter: "",
    dungeonTreasureSetsFilter: "",
    dungeonPuzzleSetsFilter: "",
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
        setDungeonMonsterSetsFilter(state, action) {
            const filter = action.payload;

            state.dungeonMonsterSetsFilter = filter;
        },
        setDungeonSetpiecesFilter(state, action) {
            const filter = action.payload;

            state.dungeonSetpiecesFilter = filter;
        },
        setDungeonTreasureSetsFilter(state, action) {
            const filter = action.payload;

            state.dungeonTreasureSetsFilter = filter;
        },
        setDungeonPuzzleSetsFilter(state, action) {
            const filter = action.payload;

            state.dungeonPuzzleSetsFilter = filter;
        },
    }
});

export default defaults.reducer;

export const { setTablesFilter, setSetpiecesFilter, setDungeonTrapSetsFilter,
    setDungeonMonsterSetsFilter, setDungeonSetpiecesFilter, setDungeonTreasureSetsFilter,
    setDungeonPuzzleSetsFilter
 } = defaults.actions;
