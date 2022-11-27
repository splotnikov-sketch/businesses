import { useState } from 'react'
import AuthContent from 'components/auth/AuthContent'
import LoadingOverlay from 'components/ui/LoadingOverlay'
import { useAppContext } from 'contexts/AppContext'

function SignupScreen() {
  const { state, signUp, postIdentityEvent } = useAppContext()
  const { browser_id } = state.auth
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const signupHandler = ({ email, password }) => {
    setIsAuthenticating(true)
    const signUpResult = signUp(email, password)
    if (signUpResult) {
      postIdentityEvent({ browser_id, page: 'signup' })
    }
    setIsAuthenticating(false)
  }

  if (isAuthenticating) {
    return <LoadingOverlay message='Creating user...' />
  }

  return <AuthContent onAuthenticate={signupHandler} />
}

export default SignupScreen
