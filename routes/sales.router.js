import { Router } from "express"
import SalesModel from "../models/sales.model.js"
import { checkRole, getUserData } from "../middlewares/getUserData.js"

const salesRouter = Router()
salesRouter.use(getUserData)
salesRouter.use(checkRole(["gestion_ventas", "admin"]))

salesRouter.get("/", async (req, res) => {
  try {
    const sales = await SalesModel.find()
      .populate("cliente")
      .populate("productos.producto")
    res.json(sales)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

salesRouter.post("/", async (req, res) => {
  try {
    const { fecha, cliente, productos, total } = req.body
    const nuevaVenta = await SalesModel.create({
      fecha,
      cliente,
      productos,
      total,
    })

    res.status(201).json(nuevaVenta)
  } catch (e) {
    res.status(500).json({ message: e.message })
    console.error(e)
  }
})

export { salesRouter }
