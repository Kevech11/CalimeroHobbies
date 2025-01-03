import mongoose from "mongoose"

const categoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
})

const Category = mongoose.model("Category", categoriesSchema)

export default Category
