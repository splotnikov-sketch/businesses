import AsyncStorage from '@react-native-async-storage/async-storage'
import config from 'root/config'
import apiInstance from 'api/apiInstance'
import { isNullOrEmpty } from 'utils'

const killSession = async () => {
  try {
    if (!config.CDP_TRACKING) {
      return null
    }

    const browser_id = await AsyncStorage.getItem('browser_id')

    if (isNullOrEmpty(browser_id)) {
      return
    }

    const request = {
      channel: config.CDP_CHANNEL,
      browser_id,
    }

    const response = await apiInstance.post(`/cdp/session/kill`, request)

    console.log('/cdp/session/kill')
    console.log(response.data)

    if (response.status !== 200 || isNullOrEmpty(response.data)) {
      return null
    }

    await AsyncStorage.removeItem('browser_id')

    return {
      browser_id: response.data.ref,
    }
  } catch (error) {
    console.log(`An error occurred while trying to killSession`)
    console.log(error)
  }
}

export default killSession
