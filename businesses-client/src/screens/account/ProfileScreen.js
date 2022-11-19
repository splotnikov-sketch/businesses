import { StyleSheet, Text, View } from 'react-native'
import { useAppContext } from 'contexts/AppContext'

function ProfileScreen() {
  const { state } = useAppContext()
  const { email } = state.auth

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
