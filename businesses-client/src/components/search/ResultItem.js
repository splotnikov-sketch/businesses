import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Text, StyleSheet, Image, Pressable } from 'react-native'
import { Colors } from 'constants/styles'

const ResultItem = ({ item }) => {
  const navigation = useNavigation()

  function itemPressHandler(id, name) {
    navigation.navigate('Detail', { id: item.id, name: item.name })
  }

  return (
    <Pressable
      onPress={() => itemPressHandler(item.id, item.name)}
      style={styles.container}
    >
      <Image style={styles.image} source={{ uri: item.image_url }} />
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
    color: Colors.primary100,
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
