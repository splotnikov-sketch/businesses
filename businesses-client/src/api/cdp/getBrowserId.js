import config from 'root/config'
import apiInstance from 'api/apiInstance'
import { isNullOrEmpty } from 'utils'

const getBrowserId = async () => {
  try {
    if (!config.CDP_TRACKING) {
      return null
    }

    const response = await apiInstance.get(`/cdp/browser/id`)

    console.log('getBrowserId-response.data')
    console.log(response.data)

    if (response.status !== 200 || isNullOrEmpty(response.data)) {
      return null
    }

    return {
      browser_id: response.data.browser_id,
    }
  } catch (error) {
    console.log(`An error occurred while trying to retrieve browser id`)
    console.log(error)
  }
}

export default getBrowserId
