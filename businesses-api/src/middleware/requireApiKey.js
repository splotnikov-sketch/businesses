import config from '../config'

const requireApiKey = (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).send({ error: 'Missing api key' })
  }

  const token = authorization.replace('Bearer ', '')
  if (config.API_KEY !== token) {
    return res.status(401).send({ error: 'Api key is invalid' })
  }
  next()
}

export default requireApiKey
