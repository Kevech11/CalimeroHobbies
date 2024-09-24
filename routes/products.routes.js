import { Router } from "express"
import ProductModel from "../models/products.model.js"

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

export { productsRouter }
