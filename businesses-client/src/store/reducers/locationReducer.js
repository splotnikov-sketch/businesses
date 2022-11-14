import {
  DETECTING_LOCATION,
  SET_LOCATION,
  SET_LOCATION_UNKNOWN,
} from '../types'

export const initialState = {
  cityState: '',
  latitude: null,
  longitude: null,
  isDetecting: false,
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
      }

    case SET_LOCATION_UNKNOWN:
      return {
        cityState: '',
        latitude: null,
        longitude: null,
        isDetecting: false,
      }

    default: {
      return state
    }
  }
}
