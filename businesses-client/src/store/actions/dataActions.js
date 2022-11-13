import apiInstance from '../../api/apiInstance'
import {
  PERFORMING_SEARCH,
  SET_SEARCH_RESULTS,
  LOADING_DETAIL,
  SET_DETAIL,
  SET_DATA_ERRORS,
  CLEAR_DATA_ERRORS,
} from '../types'

export const search = (dispatch) => {
  return async (latitude, longitude, term) => {
    dispatch({ type: CLEAR_DATA_ERRORS })
    dispatch({ type: PERFORMING_SEARCH })

    const payload = {
      term: term,
      lat: latitude,
      lon: longitude,
    }

    try {
      const response = await apiInstance.post(`/businesses/search`, payload)

      const { data } = response

      const businesses = data.map((x) => ({
        id: x.id,
        name: x.name,
        url: x.url,
        image_url: x.image_url,
        review_count: x.review_count,
        price: x.price,
        rating: x.rating,
        distance_miles: x.distance_miles.toFixed(2),
        address: `${x.location.address1}\n${x.location.city} ${x.location.state}, ${x.location.zip_code}`,
      }))

      dispatch({
        type: SET_SEARCH_RESULTS,
        payload: { businesses: businesses },
      })
    } catch (error) {
      console.log(error)
      dispatch({
        type: SET_SEARCH_RESULTS,
        payload: { businesses: null },
      })
      dispatch({
        type: SET_DATA_ERRORS,
        payload: 'Something went wrong',
      })
    }
  }
}

export const getBusinessDetail = (dispatch) => {
  return async (id) => {
    dispatch({ type: CLEAR_DATA_ERRORS })
    dispatch({ type: LOADING_DETAIL })
    try {
      const response = await apiInstance.get(`/businesses/${id}`)

      dispatch({
        type: SET_DETAIL,
        payload: { business: response.data },
      })
    } catch (error) {
      console.log(error)
      dispatch({ type: SET_DETAIL, payload: { business: null } })
      dispatch({
        type: SET_DATA_ERRORS,
        payload: 'Something went wrong',
      })
    }
  }
}
