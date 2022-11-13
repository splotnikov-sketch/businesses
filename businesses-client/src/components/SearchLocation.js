import React, { useState, useEffect, useRef } from 'react'
import { Text, StyleSheet, View, TextInput, Pressable } from 'react-native'
import { Button } from '@rneui/base'
import { MaterialIcons } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useAppContext } from '../contexts/AppContext'

const SearchLocation = () => {
  const { state, detectLocation, lookupLocation } = useAppContext()
  const [location, setLocation] = useState('N/A')
  const [editMode, setEditMode] = useState(false)
  const locationEditRef = useRef()

  useEffect(() => {
    ;(async () => {
      await detectLocation()
    })()
  }, [])

  useEffect(() => {
    setLocation(state.location.location)
  }, [state.location.location])

  const onViewPress = () => {
    setEditMode(true)
  }

  const onClearPress = () => {
    setLocation('')
    if (editMode && locationEditRef.current) {
      locationEditRef.current.focus()
    }
  }

  const onSetPress = async () => {
    const lookupLocationResult = await lookupLocation(location)
    if (lookupLocationResult) {
      setEditMode(false)
      return
    }
    setLocation('')
  }

  const onCancelPress = () => {
    setEditMode(false)
    setLocation(
      state.location.location !== null ? state.location.location : 'N/A'
    )
  }

  return (
    <View style={styles.mainContainer}>
      {!editMode && (
        <Pressable style={styles.viewContainer} onPress={onViewPress}>
          <Text style={styles.viewLabel}>Location: </Text>
          <Text style={styles.viewText}>{location}</Text>
        </Pressable>
      )}
      {editMode && (
        <View style={styles.editContainer}>
          <View style={styles.editBox}>
            <Pressable style={styles.clearBox} onPress={onClearPress}>
              <MaterialIcons name='clear' style={styles.clearIcon} />
            </Pressable>
            <TextInput
              ref={locationEditRef}
              style={styles.editText}
              placeholder='City and State'
              value={location}
              onChangeText={(text) => setLocation(text)}
              autoCorrect={false}
              autoCapitalize='words'
            />
          </View>
          <Button
            buttonStyle={styles.setButton}
            containerStyle={styles.setButtonContainer}
            onPress={onSetPress}
            disabled={location === ''}
          >
            <MaterialIcons
              name='check-circle-outline'
              size={24}
              color='black'
            />
          </Button>
          <Button
            buttonStyle={styles.cancelButton}
            containerStyle={styles.cancelButtonContainer}
            onPress={onCancelPress}
          >
            <MaterialCommunityIcons name='cancel' size={24} color='black' />
          </Button>
        </View>
      )}
      {state.location.location === null && !state.location.isDetecting && (
        <Text style={styles.errorText}>
          Please setup location to perform search
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {},
  errorText: {
    fontSize: 12,
    color: 'red',
    marginLeft: 10,
  },
  viewContainer: {
    marginStart: 10,
    flexDirection: 'row',
  },

  viewLabel: {
    fontWeight: 'bold',
    backgroundColor: '#d3d3d3',
    borderColor: 'black',
    borderRadius: 8,
    borderWidth: 1,
    padding: 4,
  },

  viewText: {
    padding: 4,
  },

  editContainer: {
    height: 40,
    borderRadius: 7,
    marginLeft: 10,
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: '#d3d3d3',
    justifyContent: 'space-between',
  },

  editBox: {
    flexDirection: 'row',
  },

  editText: {
    marginStart: 5,
    width: 200,
  },

  clearBox: {
    fontSize: 30,
    color: 'black',
    alignSelf: 'center',
  },

  clearIcon: {
    fontSize: 30,
    alignSelf: 'center',
  },
  // set button
  setButton: {
    width: 60,
    backgroundColor: '#BEBEBF',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
  },
  setButtonContainer: {},

  // cancel button
  cancelButton: {
    width: 60,
    backgroundColor: '#BEBEBF',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
  },
  cancelButtonContainer: {
    //width: 80,
  },
})

export default SearchLocation
