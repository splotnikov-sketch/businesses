import axios from 'axios'
import { Request, Response } from 'express'
import {
  writeJsonResponse,
  writeResponse500,
  writeResponseError,
} from '@root/utils/api/expressHelpers'
import logger from '@root/utils/logger'
import { isNullOrEmpty } from '@root/utils/common'
import config from '@root/config'

const geopify = axios.create({
  baseURL: config.geoapify.uri,
  timeout: 1000,
})

export async function locationSearch(
  req: Request,
  res: Response
): Promise<void> {
  const { term } = req.body

  if (isNullOrEmpty(term)) {
    writeResponseError(
      res,
      400,
      'bad_request',
      'Search term has to be supplied'
    )
  }

  try {
    const response = await geopify.get('/search', {
      params: {
        text: term,
        limit: 1,
        apiKey: config.geoapify.key,
      },
    })

    const data = await response.data

    if (
      isNullOrEmpty(data) ||
      isNullOrEmpty(data.features) ||
      data.features[0].properties === null
    ) {
      writeJsonResponse(res, 404, {
        error: {
          type: 'not_found',
          message: `No location for term ${term}`,
        },
      })
    }

    const propertiesElement = data.features[0].properties

    const result = {
      city: propertiesElement.city,
      county: propertiesElement.county,
      state: propertiesElement.state,
      postcode: propertiesElement.postcode,
      country: propertiesElement.country,
      country_code: propertiesElement.country_code,
      longitude: propertiesElement.lon,
      latitude: propertiesElement.lat,
      state_code: propertiesElement.state_code,
      formatted: propertiesElement.formatted,
      address_line1: propertiesElement.address_line1,
      address_line2: propertiesElement.address_line2,
    }

    writeJsonResponse(res, 200, result)
  } catch (error) {
    logger.error(`locationSearch: ${error}`)
    writeResponse500(res)
  }
}
