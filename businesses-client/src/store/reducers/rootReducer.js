import combineReducers from './combineReducers'
import {
  initialState as locationInitialState,
  locationReducer,
} from './locationReducer'
import { initialState as dataInitialState, dataReducer } from './dataReducer'
import { initialState as authInitialState, authReducer } from './authReducer'
import { initialState as cdpInitialState, cdpReducer } from './cdpReducer'

export const initialState = {
  location: locationInitialState,
  data: dataInitialState,
  auth: authInitialState,
  cdp: cdpInitialState,
}

const rootReducer = combineReducers({
  location: locationReducer,
  data: dataReducer,
  auth: authReducer,
  cdp: cdpReducer,
})

export { rootReducer }
