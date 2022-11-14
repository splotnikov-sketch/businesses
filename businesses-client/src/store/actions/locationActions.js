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
import states from '../../constants/states'
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
    const { granted } = await requestForegroundPermissionsAsync()
    if (!granted) {
      console.log('Permission to access location was denied')
      noLocationDetected(dispatch)
      return
    }

    const currentPosition = await getCurrentPositionAsync({})
    if (currentPosition === null || currentPosition.coords === null) {
      noLocationDetected(dispatch)
    }

    const { latitude, longitude } = currentPosition.coords

    const response = await reverseGeocodeAsync({
      latitude,
      longitude,
    })

    if (response === null) {
      console.log(`reverseGeocodeAsync response is null`)
      noLocationDetected(dispatch)
    }

    const stateAbbreviation = states.find((x) => x.label === response[0].region)

    dispatch({
      type: SET_LOCATION,
      payload: {
        cityState: `${response[0].city}, ${stateAbbreviation.value}`,
        latitude,
        longitude,
      },
    })
  }
}

export const lookupLocation = (dispatch) => {
  return async (locationTerm) => {
    try {
      const response = await apiInstance.post('/location/search', {
        term: locationTerm,
      })

      if (isNullOrEmpty(response) || isNullOrEmpty(response.data)) {
        noLocationDetected(dispatch)
        return false
      }

      dispatch({
        type: SET_LOCATION,
        payload: {
          cityState: response.data.address_line1,
          latitude: response.data.lat,
          longitude: response.data.lon,
        },
      })
      return
    } catch (error) {
      console.log(error)
      noLocationDetected(dispatch)
      return
    }
  }
}
