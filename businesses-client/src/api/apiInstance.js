// /api/businesses.js

import axios from 'axios'
import config from '../config'

const apiInstance = axios.create({
  baseURL: config.BUSINESS_API_URI,
  timeout: 1000,
})

console.log('config.BUSINESS_API_URI')
console.log(config.BUSINESS_API_URI)

export default apiInstance
