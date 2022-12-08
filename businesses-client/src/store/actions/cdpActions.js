import AsyncStorage from '@react-native-async-storage/async-storage'
import { SET_BROWSER_ID } from 'store/types'
import { isNullOrEmpty } from 'utils'
import getBrowserId from 'api/cdp/getBrowserId'

export const initialState = {
  browser_id: null,
}

export const getCdpBrowserId = (dispatch) => {
  return async () => {
    const result = await getBrowserId()

    if (!isNullOrEmpty(result)) {
      await AsyncStorage.setItem('browser_id', result.browser_id)

      dispatch({
        type: SET_BROWSER_ID,
        payload: {
          browser_id: result.browser_id,
        },
      })
    }
  }
}
