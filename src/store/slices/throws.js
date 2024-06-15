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
        updateThrow(state, action) {
            const { index, result, timestamp } = action.payload;

            state.sequence[index] = { result, timestamp };
        },
        deleteThrow(state, action) {
            const { index } = action.payload;

            state.sequence.splice(index, 1);
        },
        clearThrows(state, action) {
            state.sequence = [];
        }
    }
});

export default throws.reducer;

export const { addThrow, updateThrow, deleteThrow, clearThrows } = throws.actions;
