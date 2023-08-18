// third-party
import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';

// project imports
import rootReducer from './reducer';

// ==============================|| REDUX - MAIN STORE ||============================== //

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, immutableCheck: false })
});

const persister = persistStore(store);

const { dispatch } = store;

export { store, persister, dispatch };
