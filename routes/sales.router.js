import { Router } from "express"
import SalesModel from "../models/sales.model.js"
import ProductModel from "../models/products.model.js"
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
    const { fecha, cliente, productos, total, esMayorista, paymentMethod } =
      req.body

    for (const producto of productos) {
      const productoDB = await ProductModel.findById(producto.producto)
      if (productoDB.stock < producto.cantidad) {
        return res.status(400).json({
          message: `No hay stock suficiente para el producto ${productoDB.nombre}`,
        })
      }
    }

    const nuevaVenta = await SalesModel.create({
      paymentMethod,
      esMayorista,
      fecha,
      cliente,
      productos,
      total,
    })

    for (const producto of productos) {
      await ProductModel.findByIdAndUpdate(producto.producto, {
        $inc: { stock: -producto.cantidad },
      })
    }

    res.status(201).json(nuevaVenta)
  } catch (e) {
    res.status(500).json({ message: e.message })
    console.error(e)
  }
})

salesRouter.delete("/:id", async (req, res) => {
  try {
    // Volvemos a sumar el stock de los productos
    const venta = await SalesModel.findById(req.params.id)
    for (const producto of venta.productos) {
      await ProductModel.findByIdAndUpdate(producto.producto, {
        $inc: { stock: producto.cantidad },
      })
    }

    await SalesModel.findByIdAndDelete(req.params.id)
    res.json({ message: "Venta eliminada" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export { salesRouter }
