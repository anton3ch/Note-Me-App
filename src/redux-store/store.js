import { combineReducers } from 'redux';
import themeReducer from './reducers';

const rootReducer = combineReducers({
    theme: themeReducer
});


export default rootReducer;