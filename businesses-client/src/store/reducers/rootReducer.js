import combineReducers from './combineReducers'
import {
  initialState as locationInitialState,
  locationReducer,
} from './locationReducer'
import { initialState as dataInitialState, dataReducer } from './dataReducer'
import { initialState as authInitialState, authReducer } from './authReducer'

export const initialState = {
  location: locationInitialState,
  data: dataInitialState,
  auth: authInitialState,
}

const rootReducer = combineReducers({
  location: locationReducer,
  data: dataReducer,
  auth: authReducer,
})

export { rootReducer }
