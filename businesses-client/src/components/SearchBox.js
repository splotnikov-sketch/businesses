import IconButton from 'components/ui/IconButton'
import { useAppContext } from 'contexts/AppContext'
import React, { useEffect, useRef } from 'react'
import { StyleSheet, View, TextInput } from 'react-native'

const SearchBox = ({ term, onTermChange, onEndEditing }) => {
  const { state } = useAppContext()
  const searchEditRef = useRef(null)

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
        border={null}
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
