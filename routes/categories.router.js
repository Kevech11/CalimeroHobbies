import { Router } from "express"
import Category from "../models/categories.model.js"
import { checkRole, getUserData } from "../middlewares/getUserData.js"
import fs from "fs"

const categoriesRouter = Router()

categoriesRouter.get("/", async (req, res) => {
  const categories = await Category.find()
  res.json(categories)
})

categoriesRouter.use(getUserData)
categoriesRouter.use(checkRole("admin"))
categoriesRouter.post("/", async (req, res) => {
  const { name } = req.body
  try {
    await fs.promises.mkdir(`./Public/Pages/Productos/img/${name}`)
    const category = await Category.create({ name })
    res.status(201).json(category)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

categoriesRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body
    const oldName = (await Category.findById(id)).name
    await fs.promises.rename(`./Public/Pages/Productos/img/${oldName}`, `./Public/Pages/Productos/img/${name}`)
    const category = await Category.findByIdAndUpdate(id, { name }, { new: true })
    res.json(category)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

categoriesRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const name = (await Category.findById(id)).name
    await fs.promises.rmdir(`./Public/Pages/Productos/img/${name}`)
    await Category.findByIdAndDelete(id)
    res.json({ message: "Category deleted" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

export default categoriesRouter
