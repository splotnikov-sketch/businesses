import { useState } from 'react'
import AuthContent from 'components/auth/AuthContent'
import LoadingOverlay from 'components/ui/LoadingOverlay'
import { useAppContext } from 'contexts/AppContext'

function SignupScreen() {
  const { signUp } = useAppContext()
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const signupHandler = ({ email, password }) => {
    setIsAuthenticating(true)
    signUp(email, password)
    setIsAuthenticating(false)
  }

  if (isAuthenticating) {
    return <LoadingOverlay message='Creating user...' />
  }

  return <AuthContent onAuthenticate={signupHandler} />
}

export default SignupScreen
