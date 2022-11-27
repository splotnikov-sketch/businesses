import { Platform } from 'react-native'
import config from 'root/config'
import apiInstance from 'api/apiInstance'
import { isNullOrEmpty } from 'utils'

const postSearchEvent = async (event) => {
  try {
    if (!config.CDP_TRACKING) {
      return null
    }

    const { browser_id, page, lat, lon, cityState, term, ext } = event

    console.log(
      'postSearchEvent',
      browser_id,
      page,
      lat,
      lon,
      cityState,
      term,
      ext
    )

    if (
      isNullOrEmpty(browser_id) ||
      isNullOrEmpty(page) ||
      isNullOrEmpty(lat) ||
      isNullOrEmpty(lon) ||
      isNullOrEmpty(cityState) ||
      isNullOrEmpty(term)
    ) {
      return null
    }

    const request = {
      channel: config.CDP_CHANNEL,
      browser_id,
      page,
      lat,
      lon,
      cityState,
      term,
      platform: Platform.OS,
    }

    if (!isNullOrEmpty(ext)) {
      request.ext = ext
    }

    console.log('postSearchEvent-request')
    console.log(request)

    const response = await apiInstance.post(`/cdp/event/search`, request)

    if (response.status !== 200 || isNullOrEmpty(response.data)) {
      return null
    }

    return {
      ref: response.data.ref,
    }
  } catch (error) {
    console.log(`An error occurred while sending search event`)
    console.log(error)
  }
}

export default postSearchEvent
