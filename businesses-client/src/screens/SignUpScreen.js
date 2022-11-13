import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { useAppContext } from '../contexts/AppContext'
import AuthForm from '../components/ui/AuthForm'
import NavLink from '../components/ui/NavLink'

const SignUpScreen = ({ navigation }) => {
  const { state, signUp, clearAuthError } = useAppContext()

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      clearAuthError()
    })
    return unsubscribe
  }, [navigation])

  return (
    <View style={styles.container}>
      <AuthForm
        headerText='Sign Up for Tracker'
        errorMessage={state.auth.errorMessage}
        submitButtonText='Sign Up'
        onSubmit={signUp}
      />
      <NavLink
        routeName='Sign In'
        text='Already have an account? Sign in instead!'
      />
    </View>
  )
}

SignUpScreen.navigationOptions = () => {
  return {
    header: () => false,
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 250,
  },
})

export default SignUpScreen
