import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

// project imports
import throwsReducer from './slices/throws';
import defaultsReducer from './slices/defaults';
import contentReducer from './slices/content';


// ==============================|| COMBINE REDUCER ||============================== //

const flatReducer = combineReducers({
    throws: throwsReducer,
    defaults: defaultsReducer,
    content: contentReducer,
});

const persistConfig = {
    key: 'root',
    storage
};

const reducer = persistReducer(persistConfig, flatReducer);

/*
Per accedere a una slice, ad esempio "throws":

  const throws = useSelector((st) => st.throws);

..e poi si può accedere a throws.sequence, throws.sequence.length, throws.sequence[0], ecc.

Per chiamare le action, ad esempio "clearThrows":

    const dispatch = useDispatch();
    dispatch(clearThrows());
*/

export default reducer;
