import {
  SET_AUTHENTICATED,
  SIGN_OUT,
  CLEAR_AUTH_ERROR,
  ADD_AUTH_ERROR,
} from '../types'

export const initialState = {
  email: null,
  token: null,
  errorMessage: '',
}

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTHENTICATED: {
      return {
        email: action.payload.email,
        token: action.payload.token,
        errorMessage: '',
      }
    }

    case CLEAR_AUTH_ERROR: {
      return { ...state, errorMessage: '' }
    }

    case ADD_AUTH_ERROR: {
      return {
        email: null,
        token: null,
        errorMessage: action.payload.errorMessage,
      }
    }

    case SIGN_OUT: {
      return { email: null, token: null, errorMessage: '' }
    }

    default: {
      return state
    }
  }
}
