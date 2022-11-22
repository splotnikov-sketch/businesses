// /routes/yelpRoutes.js

import axios from 'axios'
import express from 'express'
import config from '../config'
import { isNullOrEmpty } from '../utils'
import { apiResponseMessage } from '../constants'

const router = express.Router()

const yelp = axios.create({
  baseURL: config.YELP_URI,
  timeout: 1000,
  headers: { Authorization: `Bearer ${config.YELP_TOKEN}` },
})

router.post('/categories', async (req, res) => {
  try {
    const response = await yelp.get('/categories', {
      params: {
        locale: 'en_US',
      },
    })

    if (response.status === 200) {
      const { data } = response

      return res.json(data)
    }

    return res.status(500).send({ error: apiResponseMessage[500] })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: apiResponseMessage[500] })
  }
})

router.post('/search', async (req, res) => {
  const body = req.body

  const { lat, lon } = body

  if (isNullOrEmpty(lat) || isNullOrEmpty(lon)) {
    return res
      .status(400)
      .send({ error: 'Latitude and longitude have to be supplied' })
  }

  let params = {
    latitude: lat,
    longitude: lon,
  }

  if (!isNullOrEmpty(body.term)) {
    params.term = body.term
  }

  if (!isNullOrEmpty(body.categories)) {
    params.categories = body.categories
  }

  if (!isNullOrEmpty(body.radius)) {
    const parsedRadius = parseInt(body.radius)
    params.radius = !isNullOrEmpty(parsedRadius) ? parsedRadius : 25
  }

  if (!isNullOrEmpty(body.offset)) {
    const parsedOffset = parseInt(body.offset)
    if (!isNullOrEmpty(parsedOffset) && parsedOffset > 0) {
      params.offset = parsedOffset
    }
  }

  if (!isNullOrEmpty(body.limit)) {
    const parsedLimit = parseInt(body.limit)
    params.limit = !isNullOrEmpty(parsedLimit) ? parsedLimit : 50
  }

  try {
    const response = await yelp.get('/businesses/search', {
      params: params,
    })

    if (response.status === 200) {
      const { data } = response

      const businesses = data.businesses.map((x, index) => ({
        id: x.id,
        index: index,
        name: x.name,
        distance_meters: x.distance,
        distance_km: x.distance / 1000,
        distance_miles: x.distance / 1609.344,
        location: {
          zip_code: x.location.zip_code,
          state: x.location.state,
          city: x.location.city,
          address1: x.location.address1,
          address2: x.location.address2,
        },
        url: x.url,
        image_url: x.image_url,
        review_count: x.review_count,
        price: x.price,
        rating: x.rating,
        categories: x.categories,
        transactions: x.transactions,
        phone: x.phone,
        is_closed: x.is_closed,
      }))

      return res.json(businesses)
    }

    console.log(data.error)
    return res.status(500).send({ error: apiResponseMessage[500] })
  } catch (error) {
    const errorDetail = error.response.data.error
    console.log(errorDetail)
    return res.status(500).send({ error: apiResponseMessage[500] })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const response = await yelp.get(`/businesses/${req.params.id}`)

    if (response.status === 200) {
      const { data } = response

      return res.json(data)
    }

    if (response.status === 404) {
      return res.status(404).send({ error: apiResponseMessage[404] })
    }

    return res.status(500).send({ error: apiResponseMessage[500] })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: apiResponseMessage[500] })
  }
})

export default router
