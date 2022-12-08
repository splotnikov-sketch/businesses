import mongoose from 'mongoose'

const termSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
})

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  terms: [termSchema],
})

const Category = mongoose.model('Category', categorySchema)

export { Category }
