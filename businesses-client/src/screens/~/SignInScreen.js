import React, { useEffect } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import AuthForm from '../../components/ui/AuthForm'
import NavLink from '../../components/ui/NavLink'
import { useAppContext } from '../../contexts/AppContext'

const SignInScreen = ({ navigation }) => {
  const { state, signIn, clearAuthError } = useAppContext()

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      clearAuthError()
    })
    return unsubscribe
  }, [navigation])

  return (
    <View style={styles.container}>
      <AuthForm
        headerText='Sign In to Your Account'
        errorMessage={state.auth.errorMessage}
        onSubmit={signIn}
        submitButtonText='Sign In'
      />
      <NavLink
        text="Don't have an account? Sign up instead"
        routeName='Sign Up'
      />
    </View>
  )
}

SignInScreen.navigationOptions = {
  header: () => false,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 250,
  },
})

export default SignInScreen
