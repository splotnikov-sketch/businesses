import ResultsList from 'components/search/ResultsList'
import SearchBox from 'components/search/SearchBox'
import SearchLocation from 'components/location/SearchLocation'
import Loader from 'components/ui/Loader'
import { useAppContext } from 'contexts/AppContext'
import { Text, StyleSheet, View, ScrollView } from 'react-native'
import { isNullOrEmpty } from 'utils/index'
import { Colors } from 'constants/styles'
import useViewEvent from 'hooks/useViewEvent'

const SearchScreen = () => {
  const { state } = useAppContext()
  const { categories, businesses, errors, isLoading, cityState, term } =
    state.data

  useViewEvent('search')

  const getByAlias = (alias) => {
    const filtered = businesses.filter((x) =>
      x.categories.findIndex((y) => y.alias === alias)
    )
    return filtered
  }

  const ResultsToShow = () => {
    let sortedCategories = categories
    if (categories !== null) {
      sortedCategories = categories.sort((item1, item2) =>
        item1.num < item2.num ? 1 : -1
      )
    }

    if (!isNullOrEmpty(sortedCategories)) {
      return (
        <ScrollView style={styles.results}>
          {sortedCategories.map((x) => (
            <ResultsList
              key={x.alias}
              title={x.title}
              data={getByAlias(x.alias)}
            />
          ))}
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
      <View style={styles.searchParamsContainer}>
        <SearchLocation />
        <SearchBox />
      </View>
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
  searchParamsContainer: {
    flexDirection: 'column',
    backgroundColor: Colors.primary800,
    paddingHorizontal: 2,
    paddingVertical: 6,
    borderRadius: 8,
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
    fontWeight: 'bold',
  },
  results: {
    backgroundColor: Colors.primary800,
    marginTop: 6,
    borderRadius: 8,
  },
})

export default SearchScreen
