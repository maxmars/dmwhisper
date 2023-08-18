import { createSlice } from '@reduxjs/toolkit';

// types
const initialState = {
    sequence: [],
};

// ==============================|| SLICE - THROWS ||============================== //

const throws = createSlice({
    name: 'throws',
    initialState,
    reducers: {
        addThrow(state, action) {
            const { result, timestamp } = action.payload;

            state.sequence.push({ result, timestamp });
        },
        clearThrows(state, action) {
            state.sequence = [];
        },
    }
});

export default throws.reducer;

export const { addThrow, clearThrows } = throws.actions;
