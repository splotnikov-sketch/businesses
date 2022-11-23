import AsyncStorage from '@react-native-async-storage/async-storage'
import apiInstance from 'api/apiInstance'
import { SET_OFFERS } from 'store/types'
import config from 'root/config'
import { isNullOrEmpty } from 'utils'

export const initialState = {
  offers: null,
}

export const getOffers = (dispatch) => {
  return async () => {
    try {
      if (!config.CDP_TRACKING) {
        return
      }

      const token = await AsyncStorage.getItem('token')
      if (isNullOrEmpty(token)) {
        return
      }

      const request = {
        channel: config.CDP_CHANNEL,
      }

      const response = await apiInstance.post(`/cdp/offer`, request, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status !== 200 || isNullOrEmpty(response.data)) {
        return
      }

      dispatch({
        type: SET_OFFERS,
        payload: {
          offers: response.data,
        },
      })
    } catch (error) {
      console.log('An error occurred while getting offers')
      console.log(error)
    }
  }
}
