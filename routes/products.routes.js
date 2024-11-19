import { Router } from "express"
import ProductModel from "../models/products.model.js"
import { getUserData, checkRole } from "../middlewares/getUserData.js"

const productsRouter = Router()

productsRouter.get("/", async (req, res) => {
  try {
    const products = await ProductModel.find()
    return res.json(products)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
})

productsRouter.get("/search", async (req, res) => {
  const { term } = req.query

  try {
    const products = await ProductModel.find({
      $or: [
        { titulo: { $regex: term, $options: "i" } },
        { marca: { $regex: term, $options: "i" } },
        { categoria: { $regex: term, $options: "i" } },
      ],
    })
    return res.json(products)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
})

productsRouter.use(getUserData)
productsRouter.use(checkRole("admin"))
productsRouter.post("/", async (req, res) => {
  const { titulo, marca, precio, categoria } = req.body

  try {
    const newProduct = new ProductModel({ titulo, marca, precio, categoria })
    await newProduct.save()
    return res.status(201).json(newProduct)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
})

export { productsRouter }
