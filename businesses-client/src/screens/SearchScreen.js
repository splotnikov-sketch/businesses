import React, { useState } from 'react'
import { Text, StyleSheet, View, ScrollView } from 'react-native'
import SearchLocation from '../components/SearchLocation'
import SearchBox from '../components/SearchBox'
import ResultsList from '../components/ResultsList'
import { useAppContext } from '../contexts/AppContext'
import { List } from 'react-content-loader/native'

const SearchScreenLoader = () => {
  return <List />
}

const SearchScreen = () => {
  const { state, search } = useAppContext()

  const { latitude, longitude } = state.location
  const { businesses, errors, isLoading } = state.data
  const results = businesses ? businesses : []
  const [term, setTerm] = useState('')

  const handleSearch = async () => {
    if (state.location.cityState === '') {
      return
    }

    if (term === '') {
      return
    }

    await search(latitude, longitude, term)
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
      {isLoading ? (
        <SearchScreenLoader />
      ) : (
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
      )}
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
