import ResultsList from 'components/ResultsList'
import SearchBox from 'components/SearchBox'
import SearchLocation from 'components/SearchLocation'
import Loader from 'components/ui/Loader'
import { useAppContext } from 'contexts/AppContext'
import React, { useState } from 'react'
import { Text, StyleSheet, View, ScrollView } from 'react-native'

const SearchScreen = () => {
  const { state, search } = useAppContext()

  const { latitude, longitude } = state.location
  const { businesses, errors, isLoading } = state.data
  const results = businesses ? businesses : []
  const [term, setTerm] = useState('')
  const [noResultsMessage, setNoResultsMessage] = useState('')

  const handleSearch = async () => {
    setNoResultsMessage('')
    if (state.location.cityState === '') {
      return
    }
    if (term === '') {
      return
    }
    await search(latitude, longitude, term)

    if (results === null || results.length === 0) {
      if (term !== '') {
        setNoResultsMessage(`No results for ${term}`)
      }
    }
  }

  const ResultsToShow = () => {
    if (results !== null && results.length > 0 && term != '') {
      return (
        <ScrollView>
          <ResultsList
            title='Cost Effective'
            data={results.filter(
              (x) =>
                x.price === undefined || x.price === null || x.price === '$'
            )}
          />
          <ResultsList
            title='Bit Pricer'
            data={results.filter((x) => x.price === '$$')}
          />
          <ResultsList
            title='Big Spender'
            data={results.filter((x) => x.price === '$$$')}
          />
        </ScrollView>
      )
    }

    console.log('noResultsMessage')
    console.log(noResultsMessage)
    if (noResultsMessage !== '') {
      return (
        <View>
          <Text>{noResultsMessage}</Text>
        </View>
      )
    }

    return null
  }

  return (
    <View style={styles.container}>
      <SearchLocation />
      <SearchBox
        term={term}
        onTermChange={(x) => setTerm(x)}
        onEndEditing={() => handleSearch()}
      />
      {errors ? <Text style={styles.errorText}>{errors}</Text> : null}
      {isLoading ? <Loader /> : <ResultsToShow />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginLeft: 10,
  },
})

export default SearchScreen
