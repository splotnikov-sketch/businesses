import { useState, useEffect } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import FlatButton from 'components/ui/FlatButton'
import AuthForm from './AuthForm'
import { Colors } from 'constants/styles'
import { useAppContext } from 'contexts/AppContext'
import { isNullOrEmpty } from 'utils/index'

function AuthContent({ isLogin, onAuthenticate }) {
  const navigation = useNavigation()
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  })

  const { state, clearAuthError } = useAppContext()
  const { errorMessage } = state.auth

  const alertMessage = isLogin
    ? 'Could not log you in. Please check your credentials or try again later!'
    : 'Could not create user, please check your input and try again later.'

  useEffect(() => {
    if (isNullOrEmpty(errorMessage)) {
      return
    }

    Alert.alert(
      'Authentication failed',
      alertMessage,
      [
        {
          text: 'Ok',
          onPress: () => clearAuthError(),
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
        onDismiss: () => clearAuthError(),
      }
    )
  }, [errorMessage])

  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.replace('Signup')
    } else {
      navigation.replace('Login')
    }
  }

  function submitHandler(credentials) {
    let { email, confirmEmail, password, confirmPassword } = credentials

    email = email.trim()
    password = password.trim()

    const emailIsValid = email.includes('@')
    const passwordIsValid = password.length >= 6
    const emailsAreEqual = email === confirmEmail
    const passwordsAreEqual = password === confirmPassword

    if (
      !emailIsValid ||
      !passwordIsValid ||
      (!isLogin && (!emailsAreEqual || !passwordsAreEqual))
    ) {
      Alert.alert('Invalid input', 'Please check your entered credentials.')
      setCredentialsInvalid({
        email: !emailIsValid,
        confirmEmail: !emailIsValid || !emailsAreEqual,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
      })
      return
    }
    onAuthenticate({ email, password })
  }

  return (
    <View style={styles.authContent}>
      <AuthForm
        isLogin={isLogin}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />
      <View style={styles.buttons}>
        <FlatButton onPress={switchAuthModeHandler}>
          {isLogin
            ? `Don't have an account? Sign up instead`
            : 'Sign In to Your Account'}
        </FlatButton>
      </View>
    </View>
  )
}

export default AuthContent

const styles = StyleSheet.create({
  authContent: {
    marginTop: 64,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary100,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  buttons: {
    marginTop: 8,
  },
})
