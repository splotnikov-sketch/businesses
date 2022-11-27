import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Text, StyleSheet, Image, Pressable } from 'react-native'
import { Colors } from 'constants/styles'
import { isNullOrEmpty } from 'utils/index'

const ResultItem = ({ item }) => {
  const navigation = useNavigation()

  function itemPressHandler(id, name) {
    navigation.navigate('Detail', { id: item.id, name: item.name })
  }

  const url = !isNullOrEmpty(item.image_url)
    ? item.image_url
    : 'https://placehold.jp/250x200.png'

  return (
    <Pressable
      onPress={() => itemPressHandler(item.id, item.name)}
      style={styles.container}
    >
      <Image style={styles.image} source={{ uri: url }} />

      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.detail}>
        {item.rating} Stars, {item.review_count} reviews
        {'\n'}
        {item.distance_miles} miles
        {'\n'}
        {item.address}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  name: {
    fontWeight: 'bold',
    color: 'white',
  },
  detail: {
    color: Colors.primary30,
  },
  container: {
    marginLeft: 15,
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 200,
    borderRadius: 4,
    marginBottom: 5,
  },
})

export default ResultItem
