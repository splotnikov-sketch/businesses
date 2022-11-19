import React from 'react'

import { Text, StyleSheet, View, FlatList } from 'react-native'

import ResultItem from './ResultItem'

const ResultsList = ({ title, data }) => {
  return data && Array.isArray(data) && data.length > 0 ? (
    <View style={styles.groupContainer}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ResultItem item={item} />}
      />
    </View>
  ) : null
}

const styles = StyleSheet.create({
  groupContainer: {
    marginTop: 10,
    borderBottom: '1px solid',
    borderBottomWidth: 1,
    borderColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
    color: 'white',
  },
})

export default ResultsList
