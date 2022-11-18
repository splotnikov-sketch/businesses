import AsyncStorage from '@react-native-async-storage/async-storage'
import apiInstance from 'api/apiInstance'

import {
  SET_AUTHENTICATED,
  SIGN_OUT,
  CLEAR_AUTH_ERROR,
  ADD_AUTH_ERROR,
} from '../types'

const autError = 'Error signing in. Wrong email or password.'

const authorization = async (dispatch, email, password, authUrl) => {
  try {
    dispatch({ type: CLEAR_AUTH_ERROR })

    const response = await apiInstance.post(authUrl, {
      email,
      password,
    })

    if (response.status !== 200) {
      dispatch({
        type: ADD_AUTH_ERROR,
        payload: { errorMessage: autError },
      })
    }

    const {
      data: { token: token },
    } = response

    await AsyncStorage.setItem('token', token)

    dispatch({
      type: SET_AUTHENTICATED,
      payload: { token: token },
    })
  } catch (error) {
    console.log(error)
    dispatch({
      type: ADD_AUTH_ERROR,
      payload: { errorMessage: autError },
    })
  }
}

export const signIn = (dispatch) => {
  return async (email, password) => {
    await authorization(dispatch, email, password, `/account/signin`)
  }
}

export const signUp = (dispatch) => {
  return async (email, password) => {
    await authorization(dispatch, email, password, `/account/signup`)
  }
}

// export const signUp = (dispatch) => {
//   return async (email, password) => {
//     try {
//       dispatch({ type: CLEAR_AUTH_ERROR })

//       const response = await apiInstance.post(`/account/signup`, {
//         email,
//         password,
//       })

//       const { data } = response

//       if (response.status !== 200) {
//         dispatch({
//           type: ADD_AUTH_ERROR,
//           payload: { errorMessage: autError },
//         })
//       }

//       dispatch({
//         type: SET_AUTHENTICATED,
//         payload: { token: data.token },
//       })
//     } catch (error) {
//       console.log(error)
//       dispatch({
//         type: ADD_AUTH_ERROR,
//         payload: 'Error signing up',
//       })
//     }
//   }
// }

export const signOut = (dispatch) => {
  return async () => {
    await AsyncStorage.removeItem('token')
    dispatch({ type: SIGN_OUT })
  }
}

export const clearAuthError = (dispatch) => {
  return () => {
    dispatch({ type: CLEAR_AUTH_ERROR })
  }
}
