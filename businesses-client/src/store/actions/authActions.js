import AsyncStorage from '@react-native-async-storage/async-storage'
import apiInstance from '../../api/apiInstance'

import { SIGN_IN, SIGN_OUT, ADD_AUTH_ERROR, CLEAR_AUTH_ERROR } from '../types'

export const signIn = (dispatch) => {
  return async (email, password) => {
    try {
      dispatch({ type: CLEAR_AUTH_ERROR })
      const response = await apiInstance.post(`/account/signin`, {
        email,
        password,
      })

      const {
        data: { token: token },
      } = response

      await AsyncStorage.setItem('token', token)

      dispatch({
        type: SIGN_IN,
        payload: { token: token },
      })
    } catch (error) {
      console.log(error)
      dispatch({
        type: ADD_AUTH_ERROR,
        payload: 'Error signing in. Wrong email or password.',
      })
    }
  }
}

export const signUp = (dispatch) => {
  return async (email, password) => {
    try {
      dispatch({ type: CLEAR_AUTH_ERROR })
      const response = await apiInstance.post(`/account/signup`, {
        email,
        password,
      })

      const { data } = response

      dispatch({
        type: SIGN_IN,
        payload: { token: data.token },
      })
    } catch (error) {
      console.log(error)
      dispatch({
        type: ADD_AUTH_ERROR,
        payload: 'Error signing up',
      })
    }
  }
}

export const signOut = (dispatch) => {
  return async () => {
    dispatch({ type: CLEAR_AUTH_ERROR })
    await AsyncStorage.removeItem('token')
    dispatch({ type: SIGN_OUT })
  }
}

export const clearAuthError = (dispatch) => {
  return () => {
    dispatch({ type: CLEAR_AUTH_ERROR })
  }
}
