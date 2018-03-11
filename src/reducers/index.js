import { combineReducers } from 'redux';

import ForceReducer from './force-reducer'

const rootReducer = combineReducers({
    force: ForceReducer
});

export default rootReducer;

