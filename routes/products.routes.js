import { Router } from "express"
import ProductModel from "../models/products.model.js"
import Category from "../models/categories.model.js"
import { getUserData, checkRole } from "../middlewares/getUserData.js"
import { upload } from "../config/multer.js"
import path from "path"
import fs from "fs"

const productsRouter = Router()

productsRouter.get("/", async (req, res) => {
  try {
    const products = await ProductModel.find().populate("categoria")
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
    }).populate("categoria")
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
    }).populate("categoria")
    return res.json(products)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
})

productsRouter.use(getUserData)
productsRouter.use(checkRole("admin"))
productsRouter.post("/", upload.single("imagen"), async (req, res) => {
  const { titulo, marca, precio, categoria, stock } = req.body
  
  const category = await Category.findOne({_id: categoria})
  const { filename, destination } = req.file


  const oldPath = path.join(destination, filename)
  const newPath = path.join(destination, category.name, filename)

  try {
    await fs.promises.rename(oldPath, newPath)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal Server Error" })
  }

  try {
    const newProduct = new ProductModel({
      titulo,
      stock,
      categoria: categoria,
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

productsRouter.put("/:id", async (req, res) => {
  const { id } = req.params
  const { titulo, marca, precio, categoria: nuevoNombreCategoria, stock } = req.body

  try {
    const product = await ProductModel.findById(id)
    const {_id: idCategoria, name: nombreCategoria} = await Category.findOne({_id: product.categoria})
    await Category.findByIdAndUpdate(idCategoria, {name: nuevoNombreCategoria})
    if (!fs.existsSync(path.join("./Public/Pages/Productos/img", nuevoNombreCategoria))) {
      await fs.promises.mkdir(path.join("./Public/Pages/Productos/img", nuevoNombreCategoria))
    }
    await fs.promises.rename(path.join("./Public/Pages/Productos/img", nombreCategoria, product.imagen), path.join("./Public/Pages/Productos/img", nuevoNombreCategoria, product.imagen))
    await ProductModel.findByIdAndUpdate(id, { titulo, marca, precio, stock })
    return res.status(204).send()
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
})

productsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const product = await ProductModel.findById(id).populate("categoria")
    await fs.promises.unlink(path.join("./Public/Pages/Productos/img", product.categoria.name, product.imagen))
    await ProductModel.findByIdAndDelete(id)
    return res.status(204).send()
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
})

export { productsRouter }

