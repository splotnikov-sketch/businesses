import React, { useEffect, useLayoutEffect, useCallback } from 'react'
import { Text, StyleSheet, View, FlatList, Image } from 'react-native'
import Loader from 'components/ui/Loader'
import { useAppContext } from 'contexts/AppContext'
import { isNullOrEmpty } from 'utils/index'
import { Colors } from 'constants/styles'
import IconButton from 'components/ui/IconButton'

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

  const headerButtonPressHandler = useCallback(() => {
    console.log('Pressed!')
  }, [navigation])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <IconButton
            icon='star-outline'
            size={24}
            color='white'
            onPress={headerButtonPressHandler}
          />
        )
      },
    })
  }, [navigation, headerButtonPressHandler])

  // TODO: extract business item to component

  // function renderBusiness(itemData) {
  //  return <BusinessDetail data={itemData.item}>
  // }

  return isNullOrEmpty(business) ? (
    <Loader />
  ) : (
    <View style={styles.container}>
      <Text style={styles.name}>{business.name}</Text>
      <Text style={styles.details}>
        Address: {business.location?.display_address[0]}{' '}
        {!isNullOrEmpty(business.location?.display_address[1])
          ? business.location?.display_address[1]
          : ''}
        {'\n'}
        Phone: {business.display_phone}
      </Text>
      <FlatList
        style={styles.flatList}
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
    flexDirection: 'column',
    backgroundColor: Colors.primary800,
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  details: {
    fontSize: 12,
    marginVertical: 5,
    marginHorizontal: 10,
    color: Colors.primary30,
  },
  image: {
    height: 200,
    width: '95%',
    margin: 8,
    borderRadius: 8,
  },
  flatList: {
    height: '95%',
  },
})

export default DetailScreen
