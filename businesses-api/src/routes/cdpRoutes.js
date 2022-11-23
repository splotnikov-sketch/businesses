import axios from 'axios'
import express from 'express'
import config from '../config'

const router = express.Router()

const cdp_browser = axios.create({
  baseURL: config.CDP_BROWSER_API_URI,
  timeout: 1000,
})

const cdp_rest = axios.create({
  baseURL: config.CDP_URI,
  timeout: 1000,
})

router.get('/browser/id', async (req, res) => {
  try {
    const url = `/browser/create.json?client_key=${config.CDP_API_KEY_ID}&message={}`
    const response = await cdp_browser.get(url)

    const { data } = response

    const result = {
      browser_id: data.ref,
    }

    return res.json(result)
  } catch (error) {
    console.log('Error while calling /browser/id')
    console.log(error)
  }
})

const create_event_url = `/event/create.json?client_key=${config.CDP_API_KEY_ID}`

router.post('/event/search', async (req, res) => {
  try {
    const { channel, browser_id, lat, lon, cityState, term } = req.body
    const event = {
      channel,
      type: 'SEARCH',
      currency: 'USD',
      browser_id,
      pos: config.CDP_POINT_OF_SALE,
      product_type: 'BUSINESS',
      ext: {
        latitude: lat,
        longitude: lon,
        place: cityState,
      },
      product_name: term,
    }

    const url = create_event_url + `&message=${JSON.stringify(event)}`

    const response = await cdp_browser.get(url, event)

    res.status(201).json({ ref: response.data.ref })
    return
  } catch (error) {
    console.log('Error while calling /event/search')
    console.log(error)
  }
})

router.post('/event/identity', async (req, res) => {
  try {
    const { channel, browser_id, email } = req.body
    const event = {
      channel,
      type: 'IDENTITY',
      browser_id,
      pos: config.CDP_POINT_OF_SALE,
      identifiers: [
        {
          provider: config.CDP_ID_PROVIDER,
          id: email,
        },
      ],
    }

    const url = create_event_url + `&message=${JSON.stringify(event)}`

    const response = await cdp_browser.get(url, event)

    res.status(201).json({ ref: response.data.ref })
    return
  } catch (error) {
    console.log('Error while calling /event/identity')
    console.log(error)
  }
})

export default router
