import { SET_BROWSER_ID, SET_OFFERS, VIEW_EVENT_SENT } from 'store/types'

export const initialState = {
  browser_id: null,
  offers: null,
}

export const cdpReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_OFFERS: {
      return { offers: action.payload.offers }
    }

    case SET_BROWSER_ID: {
      return { browser_id: action.payload.browser_id }
    }

    case VIEW_EVENT_SENT: {
      const event = action.payload.event
      console.log(`View event sent. Ref: ${event}`)
    }

    default: {
      return state
    }
  }
}
