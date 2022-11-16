import {
  PERFORMING_SEARCH,
  SET_SEARCH_RESULTS,
  LOADING_DETAIL,
  SET_DETAIL,
  SET_DATA_ERRORS,
  CLEAR_DATA_ERRORS,
} from '../types'

export const initialState = {
  term: '',
  businesses: [],
  id: null,
  business: null,
  isLoading: false,
  errors: null,
}

export const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case PERFORMING_SEARCH: {
      return { ...state, businesses: [], isLoading: true }
    }

    case SET_SEARCH_RESULTS: {
      return {
        ...state,
        businesses: action.payload.businesses,
        isLoading: false,
      }
    }

    case LOADING_DETAIL: {
      return { ...state, business: null, isLoading: true }
    }

    case SET_DETAIL: {
      return {
        ...state,
        business: action.payload.business,
        isLoading: false,
      }
    }

    case SET_DATA_ERRORS: {
      return { ...state, errors: action.payload, loading: false }
    }

    case CLEAR_DATA_ERRORS: {
      return { ...state, errors: null }
    }

    default: {
      return state
    }
  }
}
