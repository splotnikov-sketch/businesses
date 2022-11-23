import apiInstance from 'api/apiInstance'
import {
  LOADING_DATA,
  SET_SEARCH_RESULTS,
  SET_DETAIL,
  SET_DATA_ERRORS,
} from 'store/types'
import { isNullOrEmpty } from 'utils/index'

export const search = (dispatch) => {
  return async (latitude, longitude, cityState, term) => {
    dispatch({ type: LOADING_DATA })

    const request = {
      term: term,
      lat: latitude,
      lon: longitude,
    }

    try {
      const response = await apiInstance.post(`/businesses/search`, request)

      const { data } = response

      let categories = []
      let businesses = []

      data.forEach((x) => {
        const business = {
          id: x.id,
          name: x.name,
          url: x.url,
          image_url: x.image_url,
          review_count: x.review_count,
          price: x.price,
          rating: x.rating,
          distance_miles: x.distance_miles.toFixed(2),
          address: `${
            !isNullOrEmpty(x.location?.address1)
              ? x.location.address1 + '\n'
              : ''
          }${x.location.city} ${x.location.state}, ${x.location.zip_code}`,
          categories: x.categories,
        }
        businesses.push(business)

        x.categories.forEach((item) => {
          const index = categories.findIndex(
            (category) => category.alias === item.alias
          )
          if (index > -1) {
            const existingCategory = categories[index]
            existingCategory.num = existingCategory.num + 1
          } else {
            categories.push({
              alias: item.alias,
              title: item.title,
              num: 1,
            })
          }
        })
      })

      dispatch({
        type: SET_SEARCH_RESULTS,
        payload: { ...request, cityState, businesses, categories },
      })
    } catch (error) {
      console.log(error)

      dispatch({
        type: SET_SEARCH_RESULTS,
        payload: { ...request, cityState, businesses: null, categories },
      })

      dispatch({
        type: SET_DATA_ERRORS,
        payload: `Something went wrong. Location: ${cityState}, term: ${term}`,
      })
    }
  }
}

export const getBusinessDetail = (dispatch) => {
  return async (id) => {
    dispatch({ type: LOADING_DATA })
    try {
      const response = await apiInstance.get(`/businesses/${id}`)
      dispatch({
        type: SET_DETAIL,
        payload: {
          id: id,
          business: response.data,
        },
      })
    } catch (error) {
      console.log(error)
      dispatch({ type: SET_DETAIL, payload: { business: null } })
      dispatch({
        type: SET_DATA_ERRORS,
        payload: `Something went wrong for ${id}`,
      })
    }
  }
}
