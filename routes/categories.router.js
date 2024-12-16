import { Router } from "express"
import Category from "../models/categories.model.js"

const categoriesRouter = Router()

categoriesRouter.get("/", async (req, res) => {
  const categories = await Category.find()
  res.json(categories)
})

export default categoriesRouter
