import { createSlice } from '@reduxjs/toolkit';

// types
const initialState = {
    tablesFilter: "",
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
    }
});

export default defaults.reducer;

export const { setTablesFilter } = defaults.actions;
