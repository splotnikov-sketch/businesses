import { Platform } from 'react-native'
import config from 'root/config'
import apiInstance from 'api/apiInstance'
import { isNullOrEmpty } from 'utils'

const postIdentityEvent = async (event) => {
  try {
    if (!config.CDP_TRACKING) {
      return null
    }

    const { browser_id, page, ext } = event

    if (isNullOrEmpty(browser_id) || isNullOrEmpty(page)) {
      return null
    }

    const request = {
      channel: config.CDP_CHANNEL,
      browser_id,
      platform: Platform.OS,
    }

    if (!isNullOrEmpty(ext)) {
      request.ext = ext
    }

    console.log('postIdentityEvent-request')
    console.log(request)

    const response = await apiInstance.post(`/cdp/event/identity`, request)

    if (response.status !== 200 || isNullOrEmpty(response.data)) {
      return null
    }

    return {
      ref: response.data.ref,
    }
  } catch (error) {
    console.log(`An error occurred while sending identity event`)
    console.log(error)
  }
}

export default postIdentityEvent
