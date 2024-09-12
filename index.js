import express from "express"
import path from "path" // Importa el módulo 'path' para manejar y transformar rutas de archivos.
import { fileURLToPath } from "url" // Importa la función 'fileURLToPath' del módulo 'url' para convertir una URL de archivo en una ruta de archivo
import { connectDB } from "./config/db.js"
import { productsRouter } from "./routes/products.routes.js"
import fs from "fs"
import ProductModel from "./models/products.model.js"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express() //Crear instancia

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//levantar nuestro FRON-END
app.use(express.static("./Public"))

app.get("/Home", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "Pages", "Home", "index.html"))
})

app.get("/Productos", (req, res) => {
  res.sendFile(
    path.join(__dirname, "Public", "Pages", "Productos", "index.html")
  )
})
app.get("/Carrito", (req, res) => {
  res.sendFile(
    path.join(__dirname, "Public", "Pages", "Productos", "carrito.html")
  )
})

app.get("/QuienesSomos", (req, res) => {
  res.sendFile(
    path.join(__dirname, "Public", "Pages", "QuienesSomos", "index.html")
  )
})
app.get("/Login", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "Pages", "Login", "index.html"))
})
app.get("/Contacto", (req, res) => {
  res.sendFile(
    path.join(__dirname, "Public", "Pages", "Contacto", "index.html")
  )
})
app.get("/Pedidos", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "Pages", "Pedidos", "index.html"))
})

//Rutas de end-point
app.use("/api/productos", productsRouter)

const port = 5001 //Configurar Puerto

//levanto el servidor
connectDB()
  .then(() => {
    const port = 5001 //Configurar Puerto

    //levanto el servidors
    app.listen(port, () => {
      console.log(`Servidor levantado en el puerto ${port}`)
    })
  })
  .catch((error) => {
    console.log("Error al conectar a la base de datos", error)
    process.exit(1)
  })
