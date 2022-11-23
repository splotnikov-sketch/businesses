// /api/businesses.js

import axios from 'axios'
import config from 'root/config'

const apiInstance = axios.create({
  baseURL: config.BUSINESS_API_URI,
  timeout: 1000,
})

apiInstance.defaults.headers.common[
  'Authorization'
] = `Bearer ${config.API_KEY}`

export default apiInstance
