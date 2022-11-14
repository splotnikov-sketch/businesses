import React, { useState, useEffect, useRef } from 'react'
import { Text, StyleSheet, View, TextInput, Pressable } from 'react-native'
import { useAppContext } from '../contexts/AppContext'
import IconButton from './ui/IconButton'

const SearchLocation = () => {
  const { state, detectLocation, lookupLocation } = useAppContext()
  const [locationTerm, setLocationTerm] = useState('')
  const [editMode, setEditMode] = useState(false)
  const locationEditRef = useRef()

  useEffect(() => {
    ;(async () => {
      await detectLocation()
    })()
  }, [])

  useEffect(() => {
    if (state.location.cityState === '') {
      return
    }
    setLocationTerm(state.location.cityState)
    if (editMode) {
      setEditMode(false)
    }
  }, [state.location.cityState])

  const onViewPress = () => {
    if (state.location.cityState !== '') {
      setLocationTerm(state.location.cityState)
      setEditMode(true)
    }
  }

  const onClearPress = () => {
    setLocationTerm('')
    if (editMode && locationEditRef.current) {
      locationEditRef.current.focus()
    }
  }

  const onSetPress = async () => {
    await lookupLocation(locationTerm)
  }

  const onCancelPress = () => {
    setEditMode(false)
  }

  return (
    <View style={styles.mainContainer}>
      {!editMode && (
        <Pressable style={styles.viewContainer} onPress={onViewPress}>
          <Text style={styles.viewLabel}>Location: </Text>
          <Text style={styles.viewText}>{state.location.cityState}</Text>
        </Pressable>
      )}
      {editMode && (
        <View style={styles.editContainer}>
          <View style={styles.editBox}>
            <IconButton
              icon='remove'
              color='black'
              size={24}
              onPress={onClearPress}
            />
            <TextInput
              ref={locationEditRef}
              style={styles.editText}
              placeholder='City and State'
              value={locationTerm}
              onChangeText={(text) => setLocationTerm(text)}
              autoCorrect={false}
              autoCapitalize='words'
            />
          </View>
          <IconButton
            icon='md-checkmark'
            size={24}
            onPress={onSetPress}
            border={true}
          />
          <IconButton
            icon='close-outline'
            size={24}
            onPress={onCancelPress}
            border={true}
          />
        </View>
      )}
      {state.location === null && !state.location.isDetecting && (
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
    justifyContent: 'flex-end',
  },

  editBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  editText: {
    marginStart: 5,
    width: 250,
  },
})

export default SearchLocation
