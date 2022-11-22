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

router.post('/event/search', async (req, res) => {
  const { channel, browser_id, term } = req.body

  const event = {
    channel,
    type: 'SEARCH',
    currency: 'USD',
    browser_id,
    pos: config.CDP_POINT_OF_SAIL,
    product_type: 'BUSINESS',
    product_name: term,
  }

  const response = await cdp_rest.post(url)
})

export default router
