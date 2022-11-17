import ResultsList from 'components/ResultsList'
import SearchBox from 'components/SearchBox'
import SearchLocation from 'components/SearchLocation'
import Loader from 'components/ui/Loader'
import { useAppContext } from 'contexts/AppContext'
import React from 'react'
import { Text, StyleSheet, View, ScrollView } from 'react-native'
import { isNullOrEmpty } from 'utils/index'

const SearchScreen = () => {
  const { state } = useAppContext()

  const { businesses, errors, isLoading, cityState, term } = state.data

  const ResultsToShow = () => {
    if (!isNullOrEmpty(businesses)) {
      return (
        <ScrollView>
          <ResultsList
            title='Cost Effective'
            data={businesses.filter(
              (x) =>
                x.price === undefined || x.price === null || x.price === '$'
            )}
          />
          <ResultsList
            title='Bit Pricer'
            data={businesses.filter((x) => x.price === '$$')}
          />
          <ResultsList
            title='Big Spender'
            data={businesses.filter((x) => x.price === '$$$')}
          />
        </ScrollView>
      )
    }
    if (isNullOrEmpty(term)) {
      return null
    }

    return (
      <View style={styles.noResultsContainer}>
        <Text>No results for </Text>
        <Text style={styles.noResultsTextHighlight}>{term}</Text>
        <Text> near by </Text>
        <Text style={styles.noResultsTextHighlight}>{cityState}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <SearchLocation />
      <SearchBox />
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
  noResultsContainer: {
    marginLeft: 10,
    marginTop: 10,
    flexDirection: 'row',
  },
  noResultsTextHighlight: {
    color: 'blue',
  },
})

export default SearchScreen
