import { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { useAppContext } from 'contexts/AppContext'
import { isNullOrEmpty } from 'utils'
import getOffers from 'api/cdp/getOffers'

function ProfileScreen() {
  const { state } = useAppContext()
  const { email } = state.auth
  const [offers, setOffers] = useState(null)
  const offersShown = useRef(false)

  useEffect(() => {
    ;(async () => {
      const offersResult = await getOffers()
      if (!isNullOrEmpty(offersResult) && !isNullOrEmpty(offersResult.offers)) {
        setOffers(offersResult.offers)
      }
    })()
  }, [])

  useEffect(() => {
    console.log('useEffect', offers)
    if (!isNullOrEmpty(offers)) {
      const offer = offers[0]
      Alert.alert(offer.title, offer.text)
      offersShown.current = true
    }
  }, [offers])

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
