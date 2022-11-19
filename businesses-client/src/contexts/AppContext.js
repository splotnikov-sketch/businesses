import { useContext } from 'react'

import { initialState, rootReducer } from 'store/reducers/rootReducer'
import createAppContext from './createAppContext'

import { detectLocation, lookupLocation } from 'store/actions/locationActions'

import { search, getBusinessDetail } from '../store/actions/dataActions'

import {
  signIn,
  signUp,
  signOut,
  clearAuthError,
} from '../store/actions/authActions'

export const { Context, AppProvider } = createAppContext(
  rootReducer,
  {
    detectLocation,
    lookupLocation,
    search,
    getBusinessDetail,
    signIn,
    signUp,
    signOut,
    clearAuthError,
  },
  initialState
)

export const useAppContext = () => useContext(Context)
