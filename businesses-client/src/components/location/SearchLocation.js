import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Text, StyleSheet, View, TextInput, Pressable } from 'react-native'
import { useAppContext } from 'contexts/AppContext'
import IconButton from 'components/ui/IconButton'
import Button from 'components/ui/Button'
import { Colors } from 'constants/styles'
import OutlinedButtonWhite from 'components/ui/OutlinedButtonWhite'

const SearchLocation = () => {
  const { state, detectLocation, lookupLocationByTerm } = useAppContext()
  const [locationTerm, setLocationTerm] = useState('')
  const [editMode, setEditMode] = useState(false)
  const locationEditRef = useRef()
  const navigation = useNavigation()

  // useEffect(() => {
  //   ;(async () => {
  //     await detectLocation()
  //   })()
  // }, [])

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
    // if (state.location.cityState !== '') {
    //   setLocationTerm(state.location.cityState)
    //   setEditMode(true)
    // }
    navigation.navigate('Edit Location')
  }

  const onClearPress = () => {
    setLocationTerm('')
    if (editMode && locationEditRef.current) {
      locationEditRef.current.focus()
    }
  }

  const onSetPress = async () => {
    await lookupLocationByTerm(locationTerm)
  }

  const onCancelPress = () => {
    setEditMode(false)
  }

  return (
    <View style={styles.mainContainer}>
      {!editMode && (
        <View style={styles.viewContainer}>
          <OutlinedButtonWhite icon='location' onPress={onViewPress}>
            Location
          </OutlinedButtonWhite>
          <Text style={styles.viewText}>{state.location.cityState}</Text>
        </View>
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
          <IconButton icon='md-checkmark' size={24} onPress={onSetPress} />
          <IconButton icon='close-outline' size={24} onPress={onCancelPress} />
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
    height: 40,
    marginStart: 5,
    flexDirection: 'row',
  },

  viewText: {
    marginLeft: 4,
    alignSelf: 'center',
    fontSize: 16,
    color: 'white',
  },

  editContainer: {
    height: 40,
    borderRadius: 6,
    marginHorizontal: 6,
    flexDirection: 'row',
    backgroundColor: Colors.primary30,
    justifyContent: 'flex-end',
  },

  editBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  editText: {
    fontSize: 16,
    marginStart: 5,
    width: 250,
  },
})

export default SearchLocation
