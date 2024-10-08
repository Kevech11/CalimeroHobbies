import { Router } from "express"
import SalesModel from "../models/sales.model.js"

const salesRouter = Router()

salesRouter.get("/", async (req, res) => {
  try {
    const sales = await SalesModel.find()
    res.json(sales)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export { salesRouter }
