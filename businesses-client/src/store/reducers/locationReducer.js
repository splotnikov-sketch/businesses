import {
  DETECTING_LOCATION,
  SET_LOCATION,
  SET_LOCATION_UNKNOWN,
  SET_LOCATION_ERROR,
  CLEAR_LOCATION_ERROR,
} from '../types'

export const initialState = {
  cityState: '',
  latitude: null,
  longitude: null,
  isDetecting: false,
  error: null,
}

export const locationReducer = (state = initialState, action) => {
  if (action.type === null) {
    return state
  }

  switch (action.type) {
    case DETECTING_LOCATION:
      return { ...initialState, isDetecting: true }

    case SET_LOCATION:
      return {
        cityState: action.payload.cityState,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
        isDetecting: false,
        error: null,
      }

    case SET_LOCATION_UNKNOWN:
      return {
        cityState: '',
        latitude: null,
        longitude: null,
        isDetecting: false,
        error: null,
      }
    case SET_LOCATION_ERROR:
      return { ...state, error: action.payload.error }

    case CLEAR_LOCATION_ERROR:
      return { ...state, error: null }

    default: {
      return state
    }
  }
}
