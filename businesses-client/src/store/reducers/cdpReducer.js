import { SET_OFFERS } from 'store/types'

export const initialState = {
  offers: null,
}

export const cdpReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_OFFERS: {
      return { offers: action.payload.offers }
    }

    default: {
      return state
    }
  }
}
