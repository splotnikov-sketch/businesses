import { SET_ERRORS, CLEAR_ERRORS } from '../types';

const initialState = {
	errors: null,
};

export default uiReducer = (state = initialState, action) => {
	if (action.type === null) {
		return state;
	}

	switch (action.type) {
		case SET_ERRORS:
			return {
				errors: action.payload,
			};

		case CLEAR_ERRORS:
			return { errors: null };

		default: {
			return state;
		}
	}
};
