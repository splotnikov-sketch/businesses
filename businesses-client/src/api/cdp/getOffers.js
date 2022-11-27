import AsyncStorage from '@react-native-async-storage/async-storage'
import config from 'root/config'
import apiInstance from 'api/apiInstance'
import { isNullOrEmpty } from 'utils'

const getOffers = async () => {
  try {
    const token = await AsyncStorage.getItem('token')
    if (isNullOrEmpty(token)) {
      console.log(`Need to be authenticated to be able to retrieve offers`)
      return null
    }

    const request = {
      channel: config.CDP_CHANNEL,
    }

    const response = await apiInstance.post(`/cdp/offer`, request, {
      headers: { Authorization: `Bearer ${token}` },
    })

    console.log('getOffers-response.data')
    console.log(response.data)

    if (response.status !== 200 || isNullOrEmpty(response.data)) {
      return null
    }

    return {
      offers: response.data,
    }
  } catch (error) {
    console.log(`An error occurred while trying to retrieve offers`)
    console.log(error)
  }
}

export default getOffers
