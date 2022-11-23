import {
  LOADING_DATA,
  SET_SEARCH_RESULTS,
  SET_DETAIL,
  SET_DATA_ERRORS,
  CLEAR_DATA_ERRORS,
} from '../types'

export const initialState = {
  lat: null,
  lon: null,
  cityState: null,
  term: null,
  businesses: null,
  categories: null,
  id: null,
  business: null,
  isLoading: false,
  errors: null,
}

export const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_DATA: {
      return { ...state, errors: null, isLoading: true }
    }

    case SET_SEARCH_RESULTS: {
      const { lat, lon, cityState, term, businesses, categories } =
        action.payload
      return {
        lat,
        lon,
        cityState,
        term,
        businesses,
        categories,
        isLoading: false,
        errors: null,
      }
    }

    case SET_DETAIL: {
      const { id, business } = action.payload

      return {
        ...state,
        id,
        business,
        errors: null,
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
