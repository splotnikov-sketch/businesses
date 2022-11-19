import IconButton from 'components/ui/IconButton'
import { useAppContext } from 'contexts/AppContext'
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, TextInput, Text } from 'react-native'
import { isNullOrEmpty } from 'utils/index'
import { Colors } from 'constants/styles'

const SearchBox = () => {
  const { state, search } = useAppContext()
  const inputRef = useRef(null)
  const [term, setTerm] = useState('')
  const [inputError, setInputError] = useState('')

  const { latitude, longitude, cityState } = state.location

  const handleSearch = async () => {
    if (cityState === '') {
      setInputError('Location should be provided')
      return
    }

    if (isNullOrEmpty(term)) {
      setInputError('Search term should be provided')
      return
    }

    setInputError('')
    await search(latitude, longitude, cityState, term)
  }

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  useEffect(() => {
    const autoSearch = async () => {
      if (isNullOrEmpty(cityState) || isNullOrEmpty(term)) {
        return
      }
      await search(latitude, longitude, cityState, term)
    }
    autoSearch()
  }, [cityState])

  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <TextInput
          ref={inputRef}
          value={term}
          onChangeText={(value) => setTerm(value)}
          style={styles.input}
          placeholder='Search'
          autoCorrect={false}
          autoCapitalize='none'
        />
        <IconButton
          icon='md-search'
          color='black'
          size={24}
          onPress={() => handleSearch()}
        />
      </View>
      {inputError !== '' ? (
        <Text style={styles.error}>{inputError}</Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginTop: 6,
  },
  searchInputContainer: {
    backgroundColor: Colors.primary100,
    marginHorizontal: 6,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 40,
    borderRadius: 6,
  },
  input: {
    fontSize: 16,
    paddingLeft: 6,
    width: 335,
  },
  error: {
    fontSize: 12,
    marginLeft: 10,
    color: 'red',
  },
})

export default SearchBox
