import { useContext } from 'react'

import { initialState, rootReducer } from 'store/reducers/rootReducer'
import createAppContext from './createAppContext'
import {
  detectLocation,
  lookupLocationByTerm,
  lookupLocationByCoordinates,
  clearLocationError,
} from 'store/actions/locationActions'
import { search, getBusinessDetail } from 'store/actions/dataActions'
import {
  getBrowserId,
  sendViewEvent,
  getOffers,
} from 'store/actions/cdpActions'

import {
  signIn,
  signUp,
  signOut,
  clearAuthError,
} from 'store/actions/authActions'

export const { Context, AppProvider } = createAppContext(
  rootReducer,
  {
    detectLocation,
    lookupLocationByTerm,
    lookupLocationByCoordinates,
    clearLocationError,
    search,
    getBusinessDetail,
    signIn,
    signUp,
    signOut,
    clearAuthError,
    getBrowserId,
    sendViewEvent,
    getOffers,
  },
  initialState
)

export const useAppContext = () => useContext(Context)
