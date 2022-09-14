import { useContext } from 'react';

import { initialState, rootReducer } from '../store/reducers/rootReducer';
import createAppContext from './createAppContext';
import {
	detectLocation,
	lookupLocation,
} from '../store/actions/locationActions';

import { search, getBusinessDetail } from '../store/actions/dataActions';

export const { Context, AppProvider } = createAppContext(
	rootReducer,
	{ detectLocation, lookupLocation, search, getBusinessDetail },
	initialState
);

export const useAppContext = () => useContext(Context);
