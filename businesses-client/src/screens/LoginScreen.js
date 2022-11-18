import { useState } from 'react'
import AuthContent from 'components/auth/AuthContent'
import LoadingOverlay from 'components/ui/LoadingOverlay'
import { useAppContext } from 'contexts/AppContext'

function LoginScreen() {
  const { signIn } = useAppContext()
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true)
    signIn(email, password)
    setIsAuthenticating(false)
  }

  if (isAuthenticating) {
    return <LoadingOverlay message='Logging you in...' />
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} />
}

export default LoginScreen
