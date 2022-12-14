import { useState } from 'react'
import AuthContent from 'components/auth/AuthContent'
import LoadingOverlay from 'components/ui/LoadingOverlay'
import { useAppContext } from 'contexts/AppContext'

function SignupScreen() {
  const { state, signUp, postIdentityEvent } = useAppContext()
  const { browser_id } = state.cdp
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const signupHandler = ({ email, password }) => {
    setIsAuthenticating(true)
    const signUpResult = signUp(email, password)
    if (signUpResult) {
      postIdentityEvent({ browser_id, page: 'signup', email })
    }
    setIsAuthenticating(false)
  }

  if (isAuthenticating) {
    return <LoadingOverlay message='Creating user...' />
  }

  return <AuthContent onAuthenticate={signupHandler} />
}

export default SignupScreen
