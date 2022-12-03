import mongoose from 'mongoose'

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
})

const cuisineSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  foods: [foodSchema],
})

const Cuisine = mongoose.model('Cuisine', cuisineSchema)

export { Cuisine }
