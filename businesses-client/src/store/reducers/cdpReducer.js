import { SET_BROWSER_ID } from 'store/types'

export const initialState = {
  browser_id: null,
}

export const cdpReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BROWSER_ID: {
      return { browser_id: action.payload.browser_id }
    }

    default: {
      return state
    }
  }
}
