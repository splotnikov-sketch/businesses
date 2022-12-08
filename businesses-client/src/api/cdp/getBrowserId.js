import AsyncStorage from '@react-native-async-storage/async-storage'
import config from 'root/config'
import apiInstance from 'api/apiInstance'
import { isNullOrEmpty } from 'utils'

const getBrowserId = async () => {
  try {
    if (!config.CDP_TRACKING) {
      return null
    }

    const response = await apiInstance.get(`/cdp/browser/id`)

    console.log('/cdp/browser/id')
    console.log(response.data)

    if (
      response.status !== 200 ||
      isNullOrEmpty(response.data) ||
      isNullOrEmpty(response.data.browser_id)
    ) {
      return null
    }

    const { browser_id } = response.data

    await AsyncStorage.setItem('browser_id', browser_id)

    return {
      browser_id: browser_id,
    }
  } catch (error) {
    console.log(`An error occurred while trying to retrieve browser id`)
    console.log(error)
  }
}

export default getBrowserId
