import combineReducers from './combineReducers';
import {
	initialState as locationInitialState,
	locationReducer,
} from './locationReducer';
import { initialState as dataInitialState, dataReducer } from './dataReducer';

export const initialState = {
	location: locationInitialState,
	data: dataInitialState,
};

const rootReducer = combineReducers({
	location: locationReducer,
	data: dataReducer,
});

export { rootReducer };
