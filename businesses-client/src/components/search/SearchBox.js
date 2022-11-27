import IconButton from 'components/ui/IconButton'
import { useAppContext } from 'contexts/AppContext'
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, TextInput, Text, Keyboard } from 'react-native'
import { isNullOrEmpty } from 'utils/index'
import { Colors } from 'constants/styles'
import postSearchEvent from 'api/cdp/postSearchEvent'

const SearchBox = () => {
  const { state, search } = useAppContext()
  const inputRef = useRef(null)
  const [term, setTerm] = useState('')
  const [inputError, setInputError] = useState('')

  const { latitude, longitude, cityState } = state.location
  const { browser_id } = state.cdp

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

    await postSearchEvent({
      browser_id,
      page: 'search',
      lat: latitude,
      lon: longitude,
      cityState,
      term,
    })
  }

  const handleSearchSilent = async () => {
    if (
      isNullOrEmpty(latitude) ||
      isNullOrEmpty(longitude) ||
      isNullOrEmpty(term)
    ) {
      return
    }
    await search(latitude, longitude, cityState, term)
    await postSearchEvent({
      browser_id,
      page: 'search',
      lat: latitude,
      lon: longitude,
      cityState,
      term,
    })
  }

  useEffect(() => {
    // const hideSubscription = Keyboard.addListener('keyboardDidHide', () =>
    //   handleSearchSilent()
    // )

    inputRef.current.focus()

    // return () => {
    //   hideSubscription.remove()
    // }
  }, [])

  // useEffect(() => {
  //   handleSearchSilent()
  // }, [cityState])

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
          returnKeyLabel='Done'
          returnKeyType='done'
          onSubmitEditing={Keyboard.dismiss}
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
    backgroundColor: Colors.primary30,
    marginHorizontal: 6,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 40,
    borderRadius: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 4,
    width: 320,
  },
  error: {
    fontSize: 12,
    marginLeft: 10,
    color: 'red',
  },
})

export default SearchBox
