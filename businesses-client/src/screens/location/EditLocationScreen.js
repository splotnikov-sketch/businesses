import { View, Text, StyleSheet } from 'react-native'
import { useAppContext } from 'contexts/AppContext'
import { Colors } from 'constants/styles'
import LocationPicker from 'components/location/LocationPicker'

const EditLocationScreen = () => {
  const { state } = useAppContext()
  return (
    <View style={styles.container}>
      <LocationPicker />
    </View>
  )
}

export default EditLocationScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
