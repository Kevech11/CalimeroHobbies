import { Router } from "express"
import ProductModel from "../models/products.model.js"
import { getUserData, checkRole } from "../middlewares/getUserData.js"
import { upload } from "../config/multer.js"
import path from "path"
import fs from "fs"

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

productsRouter.get("/categoria/:categoria", async (req, res) => {
  const { categoria } = req.params

  try {
    const searchCategorias =
      categoria.toLowerCase() === "aeromodelismo"
        ? ["aviones", "aeromodelismo"]
        : [categoria]
    const products = await ProductModel.find({
      categoria: { $in: searchCategorias.map((cat) => new RegExp(cat, "i")) },
    })
    return res.json(products)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
})

productsRouter.use(getUserData)
productsRouter.use(checkRole("admin"))
productsRouter.post("/", upload.single("imagen"), async (req, res) => {
  const { titulo, marca, precio, categoria } = req.body
  const { filename, destination } = req.file

  // Mover imagen a carpeta
  const folders = {
    aeromodelismo: "aviones",
    insumos: "insumos",
    militaria: "militaria",
    rompecabezas: "rompecabezas",
    pinturas: "insumos",
  }

  const oldPath = path.join(destination, filename)
  const newPath = path.join(destination, folders[categoria], filename)

  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: "Internal Server Error" })
    }
  })

  // filename: "1626804275052-iphone12.png"
  // destination: "/home/alejandro/Documentos/Proyecto-Final-Panaderia/Public/Pages/Productos/img"
  // mimetype: "image/png"

  try {
    const newProduct = new ProductModel({
      titulo,
      marca,
      precio,
      categoria,
      imagen: filename,
    })
    await newProduct.save()
    return res.status(201).json(newProduct)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
})

export { productsRouter }
