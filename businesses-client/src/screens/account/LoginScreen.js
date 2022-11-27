import { useState } from 'react'
import AuthContent from 'components/auth/AuthContent'
import LoadingOverlay from 'components/ui/LoadingOverlay'
import { useAppContext } from 'contexts/AppContext'
import postIdentityEvent from 'api/cdp/postIdentityEvent'

function LoginScreen() {
  const { state, signIn } = useAppContext()
  const { browser_id } = state.cdp
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true)
    const signInResult = await signIn(email, password)
    if (signInResult) {
      postIdentityEvent({ browser_id, page: 'login' })
    }
    setIsAuthenticating(false)
  }

  if (isAuthenticating) {
    return <LoadingOverlay message='Logging you in...' />
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} />
}

export default LoginScreen
