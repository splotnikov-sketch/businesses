import AsyncStorage from '@react-native-async-storage/async-storage'
import apiInstance from 'api/apiInstance'
import { SET_BROWSER_ID, SET_OFFERS } from 'store/types'
import config from 'root/config'
import { isNullOrEmpty } from 'utils'

export const initialState = {
  offers: null,
  browser_id: null,
}

export const getBrowserId = (dispatch) => {
  return async () => {
    try {
      if (!config.CDP_TRACKING) {
        return
      }

      const response = await apiInstance.get(`/cdp/browser/id`)

      if (response.status !== 200 || isNullOrEmpty(response.data)) {
        return
      }

      dispatch({
        type: SET_BROWSER_ID,
        payload: {
          browser_id: response.data.browser_id,
        },
      })
    } catch (error) {
      console.log('An error occurred while getting browser id')
      console.log(error)
    }
  }
}

export const sendViewEvent = (dispatch) => {
  return async () => {
    try {
      if (!config.CDP_TRACKING) {
        return
      }
    } catch (error) {
      console.log('An error occurred while sending view event')
      console.log(error)
    }
  }
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
