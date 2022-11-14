import React, { useEffect, useRef } from 'react'
import { StyleSheet, View, TextInput, Pressable } from 'react-native'
import { useAppContext } from '../contexts/AppContext'
import IconButton from './ui/IconButton'

const SearchBox = ({ term, onTermChange, onEndEditing }) => {
  const { state } = useAppContext()
  const searchEditRef = useRef()

  useEffect(() => {
    searchEditRef.current.focus()
  }, [state.location])

  return (
    <View style={styles.container}>
      <IconButton
        icon='md-search'
        color='black'
        size={24}
        onPress={onEndEditing}
      />
      <TextInput
        ref={searchEditRef}
        style={styles.input}
        placeholder='Search'
        value={term}
        onChangeText={onTermChange}
        autoCorrect={false}
        autoCapitalize='none'
        onEndEditing={onEndEditing}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    backgroundColor: '#d3d3d3',
    flexDirection: 'row',
    height: 40,
    borderRadius: 7,
  },
  input: {
    marginStart: 10,
    width: 300,
  },
})

export default SearchBox
