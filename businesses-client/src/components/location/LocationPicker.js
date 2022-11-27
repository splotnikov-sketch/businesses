import { useState, useEffect, useLayoutEffect, useCallback } from 'react'
import { View, StyleSheet, TextInput, Text, Alert } from 'react-native'
import OutlinedButton from 'components/ui/OutlinedButton'
import IconButton from 'components/ui/IconButton'
import { Colors } from 'constants/styles'
import { useAppContext } from 'contexts/AppContext'
import MapView, { Marker } from 'react-native-maps'
import { useNavigation } from '@react-navigation/native'
import { isNullOrEmpty } from 'utils'

function LocationPicker() {
  const navigation = useNavigation()
  const {
    state,
    detectLocation,
    lookupLocationByTerm,
    lookupLocationByCoordinates,
    clearLocationError,
  } = useAppContext()

  const { cityState, latitude, longitude, error } = state.location
  const [region, setRegion] = useState({
    latitude,
    longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })
  const [locationTerm, setLocationTerm] = useState('')

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <IconButton
          icon='exit'
          color={tintColor}
          size={32}
          onPress={exitLocationEditScreenHandler}
        />
      ),
    })
  }, [navigation, exitLocationEditScreenHandler])

  useEffect(() => {
    setLocationTerm(cityState)
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    })
  }, [state.location.cityState])

  useEffect(() => {
    if (isNullOrEmpty(error)) {
      return
    }
    setLocationTerm(cityState)
  }, [error])

  const exitLocationEditScreenHandler = useCallback(() => {
    if (isNullOrEmpty(cityState)) {
      Alert.alert(
        `No location was set`,
        `Please input valid location and tap 'Set', or tap 'Locate' button`
      )
      return
    }
    navigation.navigate('Search')
  }, [navigation, cityState])

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
      {!isNullOrEmpty(error) && <Text style={styles.errorText}>{error}</Text>}
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
          Locate
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
    backgroundColor: Colors.primary30,
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
  errorText: {
    fontSize: 12,
    color: Colors.primary100,
    marginLeft: 10,
  },
})
