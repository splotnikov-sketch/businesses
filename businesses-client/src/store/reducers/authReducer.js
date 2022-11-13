import { SIGN_IN, SIGN_OUT, ADD_AUTH_ERROR, CLEAR_AUTH_ERROR } from '../types'

export const initialState = {
  token: null,
  errorMessage: '',
}

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN: {
      return { token: action.payload, errorMessage: '' }
    }
    case SIGN_OUT: {
      return { token: null, errorMessage: '' }
    }

    case ADD_AUTH_ERROR: {
      return { ...state, errorMessage: action.payload }
    }

    case CLEAR_AUTH_ERROR: {
      return { ...state, errorMessage: '' }
    }

    default: {
      return state
    }
  }
}
