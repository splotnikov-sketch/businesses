import { useState, useEffect } from 'react'
import { stateLabelValues } from '../lib/consts'
import apiInstance from '../api/apiInstance'
import { isNullOrEmpty } from '../utils'

import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  reverseGeocodeAsync,
} from 'expo-location'

export default () => {
  const detectLocationError = `Can't detect location`
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)

  useEffect(() => {
    ;(async () => {
      console.log('calling useLocation - useEffect')
      if (location != null) {
        return
      }

      setLocationError(null)
      setIsDetectingLocation(true)

      const { granted } = await requestForegroundPermissionsAsync()
      if (!granted) {
        const error = 'Permission to access location was denied'
        console.log(error)
        setLocationError(detectLocationError)
        setIsDetectingLocation(false)
        return
      }

      const currentPosition = await getCurrentPositionAsync({})
      if (currentPosition === null || currentPosition.coords === null) {
        console.log(`Can't detect current position: ${currentPosition}`)
        setLocationError(detectLocationError)
        setIsDetectingLocation(false)
        return
      }

      const { latitude, longitude } = currentPosition.coords
      const response = await reverseGeocodeAsync({
        latitude,
        longitude,
      })

      if (response === null) {
        console.log(`reverseGeocodeAsync response is null`)
        setLocationError(detectLocationError)
        setIsDetectingLocation(false)
        return
      }

      const stateAbbreviation = stateLabelValues.find(
        (x) => x.label === response[0].region
      )

      setLocation({
        cityState: `${response[0].city}, ${stateAbbreviation.value}`,
        latitude,
        longitude,
      })
      setIsDetectingLocation(false)
    })()
  }, [])

  const lookupLocation = async (locationTerm) => {
    setLocationError(null)
    setIsDetectingLocation(true)
    try {
      const response = await apiInstance.post('/location/search', {
        term: locationTerm,
      })

      if (isNullOrEmpty(response) || isNullOrEmpty(response.data)) {
        console.log(`Can't find any location with term: ${locationTerm}`)
        setLocationError(detectLocationError)
        return
      }

      const { address_line1, lat, lon } = await response.data

      setLocation({
        cityState: address_line1,
        latitude: lat,
        longitude: lon,
      })

      setIsDetectingLocation(false)
    } catch (error) {
      console.log(error)
      setIsDetectingLocation(false)
    }
  }

  return [location, locationError, lookupLocation, isDetectingLocation]
}
