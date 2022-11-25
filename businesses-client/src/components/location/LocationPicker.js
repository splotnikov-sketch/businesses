import { useState, useEffect } from 'react'
import { View, StyleSheet, TextInput } from 'react-native'
import OutlinedButton from 'components/ui/OutlinedButton'
import IconButton from 'components/ui/IconButton'
import { Colors } from 'constants/styles'
import { useAppContext } from 'contexts/AppContext'
import MapView, { Marker } from 'react-native-maps'

function LocationPicker() {
  const {
    state,
    detectLocation,
    lookupLocationByTerm,
    lookupLocationByCoordinates,
  } = useAppContext()

  const { cityState, latitude, longitude } = state.location
  const [region, setRegion] = useState({
    latitude,
    longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })
  const [locationTerm, setLocationTerm] = useState('')

  useEffect(() => {
    setLocationTerm(cityState)
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    })
  }, [state.location.cityState])

  const getLocationHandler = async () => {
    await detectLocation()
  }

  const selectLocationHandler = async (event) => {
    await lookupLocationByCoordinates(
      event.nativeEvent.coordinate.latitude,
      event.nativeEvent.coordinate.longitude
    )
  }

  const onSetPress = async () => {
    await lookupLocationByTerm(locationTerm)
  }

  return (
    <View style={styles.container}>
      <View style={styles.editBox}>
        <IconButton
          icon='remove'
          color='black'
          size={24}
          onPress={() => setLocationTerm('')}
        />
        <TextInput
          style={styles.editText}
          placeholder='City and State'
          value={locationTerm}
          onChangeText={(text) => setLocationTerm(text)}
          autoCorrect={false}
          autoCapitalize='words'
        />

        <OutlinedButton icon='md-checkmark' onPress={onSetPress}>
          Set
        </OutlinedButton>
      </View>
      <MapView
        style={styles.mapView}
        region={region}
        onPress={selectLocationHandler}
      >
        {state.location.cityState && (
          <Marker
            coordinate={{
              latitude: state.location.latitude,
              longitude: state.location.longitude,
            }}
          ></Marker>
        )}
      </MapView>
      <View style={styles.actions}>
        <OutlinedButton icon='location' onPress={getLocationHandler}>
          Locate User
        </OutlinedButton>
      </View>
    </View>
  )
}

export default LocationPicker

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  editBox: {
    flexDirection: 'row',
    backgroundColor: Colors.primary100,
    justifyContent: 'flex-start',
  },

  editText: {
    fontSize: 16,
    marginStart: 5,
    width: '68%',
    alignSelf: 'stretch',
  },

  mapView: {
    width: '100%',
    height: '85%',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'center',
  },
})
