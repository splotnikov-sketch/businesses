import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  reverseGeocodeAsync,
} from 'expo-location'
import {
  DETECTING_LOCATION,
  SET_LOCATION,
  SET_LOCATION_UNKNOWN,
  SET_ERRORS,
} from '../types'
import apiInstance from '../../api/apiInstance'
import { stateLabelValues } from '../../lib/consts'
import { isNullOrEmpty } from '../../utils'

const noLocationDetected = (dispatch) => {
  dispatch({ type: SET_ERRORS, payload: `Can't detect location` })
  dispatch({
    type: SET_LOCATION_UNKNOWN,
  })
}

export const detectLocation = (dispatch) => {
  return async () => {
    dispatch({ type: DETECTING_LOCATION })
    const { status } = await requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      console.log('Permission to access location was denied')
      noLocationDetected(dispatch)
      return
    }

    const currentPosition = await getCurrentPositionAsync({})
    if (currentPosition === null || currentPosition.coords === null) {
      noLocationDetected(dispatch)
    }

    const latitude = currentPosition.coords.latitude
    const longitude = currentPosition.coords.longitude
    const response = await reverseGeocodeAsync({
      latitude,
      longitude,
    })

    if (response === null) {
      noLocationDetected(dispatch)
    }

    const stateAbbreviation = stateLabelValues.find(
      (x) => x.label === response[0].region
    )

    dispatch({
      type: SET_LOCATION,
      payload: {
        location: `${response[0].city}, ${stateAbbreviation.value}`,
        latitude,
        longitude,
      },
    })
  }
}

export const lookupLocation = (dispatch) => {
  return async (location) => {
    const response = await apiInstance.post('/location/search', {
      term: location,
    })

    if (isNullOrEmpty(response) || isNullOrEmpty(response.data)) {
      noLocationDetected(dispatch)
      return false
    }

    dispatch({
      type: 'SET_LOCATION',
      payload: {
        location: response.data.address_line1,
        latitude: response.data.lat,
        longitude: response.data.lon,
      },
    })
    return true
  }
}
