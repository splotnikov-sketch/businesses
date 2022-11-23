import { useEffect } from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { useAppContext } from 'contexts/AppContext'
import { isNullOrEmpty } from 'utils'

function ProfileScreen() {
  const { state, getOffers } = useAppContext()
  const { email } = state.auth

  useEffect(() => {
    ;(async () => {
      await getOffers()
    })()
  }, [])

  useEffect(() => {
    if (!isNullOrEmpty(state.cdp.offers)) {
      const offer = state.cdp.offers[0]
      Alert.alert(offer.title, offer.text)
    }
  }, [state.cdp.offers])

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.details}>You authenticated as {email}</Text>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  details: {
    fontSize: 16,
  },
})
