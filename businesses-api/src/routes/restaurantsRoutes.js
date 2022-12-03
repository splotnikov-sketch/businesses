import express from 'express'
import config from '../config'
import { isNullOrEmpty } from '../utils'
import { Cuisine } from '../models/Cuisine'
import requireApiKey from '../middleware/requireApiKey'

const router = express.Router()

router.post('/cuisine', requireApiKey, async (req, res) => {
  const { name } = req.body

  if (isNullOrEmpty(name)) {
    return res.status(400).send({ error: 'Cuisine has to be supplied' })
  }

  try {
    const existingCuisine = await Cuisine.findOne({ name })

    if (!isNullOrEmpty(existingCuisine)) {
      return res.status(409).send({ error: `Cuisine ${name} already exists` })
    }

    const cuisine = new Cuisine({ name })
    await cuisine.save()
    res.status(201).send(cuisine)
  } catch (err) {
    return res.status(422).send(err.message)
  }
})

router.get('/cuisine', requireApiKey, async (req, res) => {
  try {
    const cuisines = await Cuisine.find()
    res.status(200).json(cuisines)
  } catch (err) {
    return res.status(422).send(err.message)
  }
})

router.post('/cuisine/:cuisineName/food', requireApiKey, async (req, res) => {
  const cuisineName = req.params.cuisineName
  const { foodName } = req.body

  if (isNullOrEmpty(foodName)) {
    return res.status(400).send({ error: 'Food has to be supplied' })
  }

  try {
    let cuisine = await Cuisine.findOne({ name: cuisineName })

    if (isNullOrEmpty(cuisine)) {
      cuisine = new Cuisine({ name: cuisineName })
      await cuisine.save()
    }

    const food = cuisine.foods.filter((x) => x.name === foodName)

    if (!isNullOrEmpty(food)) {
      return res.status(409).send({
        error: `Food ${foodName} for cuisine ${cuisineName} already exists`,
      })
    }

    cuisine.foods.push({ name: foodName })

    await cuisine.save()
    res.status(201).send(cuisine)
  } catch (err) {
    return res.status(422).send(err.message)
  }
})

router.get('/food/:foodName', requireApiKey, async (req, res) => {
  try {
    const foodName = req.params.foodName

    Cuisine.find({}, (err, cuisines) => {
      cuisines.forEach((cuisine) => {
        const food = cuisine.foods.filter((x) => x.name === foodName)
        if (!isNullOrEmpty(food)) {
          const foods = cuisine.foods.map((x) => x.name)

          res.status(200).json({ cuisine: cuisine.name, foods })
        }
      })
    })

    res.status(404)
  } catch (err) {
    return res.status(422).send(err.message)
  }
})

export default router
