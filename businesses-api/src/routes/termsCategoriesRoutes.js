import express from 'express'
import { isNullOrEmpty } from '../utils'
import { Category } from '../models/Category'
import requireApiKey from '../middleware/requireApiKey'

const router = express.Router()

router.post('/', requireApiKey, async (req, res) => {
  const { name } = req.body
  console.log('name')
  console.log(name)

  if (isNullOrEmpty(name)) {
    return res.status(400).send({ error: 'Category has to be supplied' })
  }

  try {
    const storedCategory = await Category.findOne({ name })

    console.log('storedCategory')
    console.log(storedCategory)
    if (!isNullOrEmpty(storedCategory)) {
      return res.status(409).send({ error: `Category ${name} already exists` })
    }

    const category = new Category({ name })
    await category.save()
    res.status(201).send(category)
  } catch (err) {
    return res.status(422).send(err.message)
  }
})

router.get('/', requireApiKey, async (req, res) => {
  try {
    const category = await Category.find()
    res.status(200).json(category)
  } catch (err) {
    return res.status(422).send(err.message)
  }
})

router.post('/:categoryName/term', requireApiKey, async (req, res) => {
  const categoryName = req.params.categoryName
  const { name } = req.body

  if (isNullOrEmpty(name)) {
    return res.status(400).send({ error: 'Term has to be supplied' })
  }

  try {
    let category = await Category.findOne({ name: categoryName })

    if (isNullOrEmpty(category)) {
      category = new Category({ name: categoryName })
      await category.save()
    }

    const term = category.terms.filter((x) => x.name === name)

    if (!isNullOrEmpty(term)) {
      return res.status(409).send({
        error: `Term ${name} for category ${categoryName} already exists`,
      })
    }

    category.terms.push({ name })

    await category.save()
    res.status(201).send(category)
  } catch (err) {
    return res.status(422).send(err.message)
  }
})

router.get('/term/:term', requireApiKey, async (req, res) => {
  try {
    const term = req.params.term.toLowerCase()

    Category.find({}, (err, category) => {
      category.forEach((x) => {
        const storedTerm = x.terms.filter((y) => y.name === term)
        if (!isNullOrEmpty(storedTerm)) {
          const terms = x.terms.map((x) => x.name)

          res.status(200).json({ category: x.name, terms })
        }
      })
    })

    res.status(404)
  } catch (err) {
    return res.status(422).send(err.message)
  }
})

const getPreferredCategory = async (terms) => {
  // terms: [{"term":"tacos","num":1},  {"term":"stromboli","num":3}]
  if (isNullOrEmpty(terms)) {
    return null
  }

  const termsWithCategory = []
  const storedCategories = await Category.find({})
  storedCategories.forEach((storedCategory) => {
    const terms = storedCategory.terms
    terms.forEach((storedTerm) => {
      termsWithCategory.push({
        term: storedTerm.name,
        category: storedCategory.name,
      })
    })
  })

  const categoryWithCount = []

  terms.forEach((term) => {
    const index = termsWithCategory.findIndex((item) => {
      return item.term === term.term
    })
    console.log('index', index)
    if (index > 0) {
      const category = termsWithCategory[index].category
      const index1 = categoryWithCount.findIndex((item) => {
        return item.category === category
      })
      if (index1 > 0) {
        categoryWithCount[index1].num = categoryWithCount[index1].num + term.num
      } else {
        categoryWithCount.push({ category, num: +term.num })
      }
    }
  })

  const max = Math.max(...categoryWithCount.map((x) => x.num))
  const category = categoryWithCount.find((x) => x.num === max)

  return category
}

router.post('/preferred', requireApiKey, async (req, res) => {
  const { terms } = req.body
  try {
    const result = await getPreferredCategory(terms)
    res.status(200).json(result)
  } catch (error) {
    return res.status(422).send(error.message)
  }
})

export default router
