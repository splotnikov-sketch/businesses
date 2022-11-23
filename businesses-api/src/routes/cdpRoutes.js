import axios from 'axios'
import express from 'express'
import config from '../config'
import { isNullOrEmpty } from '../utils'
import requireApiKey from '../middleware/requireApiKey'
import requireAuth from '../middleware/requireAuth'

const router = express.Router()

const cdp_browser = axios.create({
  baseURL: config.CDP_BROWSER_API_URI,
  timeout: 1000,
})

const CREATE_EVENT_URL = `/event/create.json?client_key=${config.CDP_API_KEY_ID}`
const DEFAULT_CURRENCY = 'USD'
const DEFAULT_LANGUAGE = 'EN'

const cdp_rest = axios.create({
  baseURL: config.CDP_URI,
  timeout: 1000,
})

router.get('/browser/id', requireApiKey, async (req, res) => {
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

router.post('/event/view', requireApiKey, async (req, res) => {
  try {
    const {
      channel,
      browser_id,
      platform,
      device,
      page,
      currency,
      language,
      ext,
    } = req.body

    const event = {
      browser_id,
      channel,
      pos: config.CDP_POINT_OF_SALE,
      type: 'VIEW',
      page,
      currency: !isNullOrEmpty(currency) ? currency : DEFAULT_CURRENCY,
      language: !isNullOrEmpty(language) ? language : DEFAULT_LANGUAGE,
      ext: {
        platform,
        device,
        ...ext,
      },
    }

    const url = CREATE_EVENT_URL + `${JSON.stringify(event)}`
    const response = await cdp_browser.get(url)
    res.status(201).json({ ref: response.data.ref })

    return
  } catch (error) {
    console.log('Error while calling /event/search')
    console.log(error)
    res.status(500).send('Server error. Please try again later.')
  }
})

router.post('/event/search', requireApiKey, async (req, res) => {
  try {
    const {
      channel,
      browser_id,
      platform,
      device,
      lat,
      lon,
      cityState,
      term,
      currency,
      language,
      ext,
    } = req.body
    const event = {
      browser_id,
      channel,
      pos: config.CDP_POINT_OF_SALE,
      type: 'SEARCH',
      currency: !isNullOrEmpty(currency) ? currency : DEFAULT_CURRENCY,
      language: !isNullOrEmpty(language) ? language : DEFAULT_LANGUAGE,
      product_type: 'BUSINESS',
      ext: {
        platform,
        device,
        latitude: lat,
        longitude: lon,
        place: cityState,
        ...ext,
      },
      product_name: term,
    }

    const url = CREATE_EVENT_URL + `&message=${JSON.stringify(event)}`

    const response = await cdp_browser.get(url)

    res.status(201).json({ ref: response.data.ref })
    return
  } catch (error) {
    console.log('Error while calling /event/search')
    console.log(error)
    res.status(500).send('Server error. Please try again later.')
  }
})

router.post('/event/identity', requireApiKey, async (req, res) => {
  try {
    const { channel, browser_id, id, email } = req.body
    const event = {
      channel,
      type: 'IDENTITY',
      browser_id,
      pos: config.CDP_POINT_OF_SALE,
      email,
      identifiers: [
        {
          provider: config.CDP_ID_PROVIDER,
          id: email,
        },
      ],
    }

    const url = CREATE_EVENT_URL + `&message=${JSON.stringify(event)}`

    const response = await cdp_browser.get(url)

    res.status(201).json({ ref: response.data.ref })
    return
  } catch (error) {
    console.log('Error while calling /event/identity')
    console.log(error)
    res.status(500).send('Server error. Please try again later.')
  }
})

router.post('/offer', requireAuth, async (req, res) => {
  try {
    const { channel } = req.body

    const url = `/callFlows`

    const request = {
      channel,
      pointOfSale: config.CDP_POINT_OF_SALE,
      identifiers: {
        provider: config.CDP_ID_PROVIDER,
        id: req.user.email,
      },
      clientKey: config.CDP_API_KEY_ID,
      friendlyId: config.CDP_OFFER_TEMPLATE,
    }

    const response = await cdp_rest.post(url, request)

    if (response.status !== 200) {
      return res.json([])
    }

    const result = response.data.decisionOffers
      .filter((x) => x.status === 'ACTIVE')
      .map((x) => ({
        title: x.attributes.Title,
        text: x.attributes.Text,
      }))

    return res.json(result)
  } catch (error) {
    console.log('Error while calling /offer')
    console.log(error)
    res.status(500).send('Server error. Please try again later.')
  }
})

export default router
