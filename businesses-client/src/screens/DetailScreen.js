import React, { useState, useEffect } from 'react'
import { Text, StyleSheet, View, FlatList, Image } from 'react-native'
import Loader from '../components/ui/Loader'
import { useAppContext } from '../contexts/AppContext'

// alternative for components
// import {useRoute} from '@react-navigation/native'
// const route = useRoute();
// const { id } = route.params

const DetailScreen = ({ route, navigation }) => {
  const { id } = route.params
  const { state, getBusinessDetail } = useAppContext()
  const { business } = state.data

  useEffect(() => {
    ;(async () => {
      await getBusinessDetail(id)
    })()
  }, [])

  // TODO: extract business item to component

  // function renderBusiness(itemData) {
  //  return <BusinessDetail data={itemData.item}>
  // }

  return business === null ? (
    <Loader />
  ) : (
    <View style={styles.container}>
      <Text style={styles.name}>{business.name}</Text>
      <Text style={styles.details}>
        Address: {business.location?.display_address[0]}{' '}
        {business.location?.display_address[1]}
        {'\n'}
        Phone: {business.display_phone}
      </Text>
      <FlatList
        data={business.photos}
        keyExtractor={(photo) => photo}
        renderItem={({ item }) => {
          return <Image style={styles.image} source={{ uri: item }} />
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 12,
    paddingBottom: 4,
  },
  image: {
    height: 200,
    width: '95%',
    margin: 8,
    borderRadius: 8,
  },
})

export default DetailScreen
