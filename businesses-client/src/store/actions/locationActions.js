import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  reverseGeocodeAsync,
} from 'expo-location'
import {
  DETECTING_LOCATION,
  SET_LOCATION,
  SET_LOCATION_ERROR,
  CLEAR_LOCATION_ERROR,
} from 'store/types'
import apiInstance from 'api/apiInstance'
import states from 'constants/states'
import { isNullOrEmpty } from 'utils'

// TODO: refactor this - useForegroundPermissions - hook
// const [locationPermissionInformation, requestPermission] = useForegroundPermissions()

const getLocationNameByCoords = async (latitude, longitude, dispatch) => {
  try {
    const response = await reverseGeocodeAsync({
      latitude,
      longitude,
    })

    if (response === null) {
      console.log(`reverseGeocodeAsync response is null`)
      dispatch({
        type: SET_LOCATION_ERROR,
        payload: { error: `Can't detect location` },
      })
      return
    }

    const stateAbbreviation = states.find((x) => x.label === response[0].region)
    const city = !isNullOrEmpty(response[0].city)
      ? response[0].city
      : response[0].district

    dispatch({
      type: SET_LOCATION,
      payload: {
        cityState: `${city}, ${stateAbbreviation.value}`,
        latitude,
        longitude,
      },
    })
  } catch (error) {
    dispatch({
      type: SET_LOCATION_ERROR,
      payload: { error: `Can't detect location` },
    })
  }
}

export const detectLocation = (dispatch) => {
  return async () => {
    dispatch({ type: DETECTING_LOCATION })
    const { granted } = await requestForegroundPermissionsAsync()
    if (!granted) {
      const error = 'Permission to access location was denied'
      console.log(error)
      dispatch({ type: SET_LOCATION_ERROR, payload: { error } })
      return
    }

    const currentPosition = await getCurrentPositionAsync({})
    if (currentPosition === null || currentPosition.coords === null) {
      console.log('Result of getCurrentPositionAsync is null')
      dispatch({
        type: SET_LOCATION_ERROR,
        payload: { error: `Can't detect current position` },
      })
      return
    }

    const { latitude, longitude } = currentPosition.coords
    await getLocationNameByCoords(latitude, longitude, dispatch)
  }
}

export const lookupLocationByCoordinates = (dispatch) => {
  return async (latitude, longitude) => {
    await getLocationNameByCoords(latitude, longitude, dispatch)
  }
}

export const lookupLocationByTerm = (dispatch) => {
  return async (locationTerm) => {
    try {
      const response = await apiInstance.post('/location/search', {
        term: locationTerm,
      })

      if (isNullOrEmpty(response) || isNullOrEmpty(response.data)) {
        dispatch({
          type: SET_LOCATION_ERROR,
          payload: { error: `No location for term ${locationTerm}` },
        })
        return
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
      dispatch({
        type: SET_LOCATION_ERROR,
        payload: { error: `Error while looking up location` },
      })
      return
    }
  }
}

export const clearLocationError = (dispatch) => {
  return () => {
    dispatch({
      type: CLEAR_LOCATION_ERROR,
    })
  }
}
