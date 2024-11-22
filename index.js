import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import { connectDB } from "./config/db.js"
import { productsRouter } from "./routes/products.routes.js"
import { authRouter } from "./routes/auth.router.js"
import { clientsRouter } from "./routes/clients.router.js"
import { salesRouter } from "./routes/sales.router.js"
import { mpRouter } from "./routes/mercadopago.router.js"
import { contactRouter } from "./routes/contact.router.js"
import { adminRouter } from "./routes/admin.router.js"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express() //Crear instancia

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//levantar nuestro FRON-END
app.use(express.static("./Public"))

app.get("/", (req, res) => {
  res.redirect("/Home")
})

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

app.get("/Ventas", (req, res) => {
  res.sendFile(
    path.join(__dirname, "Public", "Private", "Ventas", "index.html")
  )
})

app.get("/Clientes", (req, res) => {
  res.sendFile(
    path.join(__dirname, "Public", "Private", "Clientes", "index.html")
  )
})

app.get("/Pedidos", (req, res) => {
  res.sendFile(
    path.join(__dirname, "Public", "Private", "Pedidos", "index.html")
  )
})

app.get("/Administracion", (req, res) => {
  res.sendFile(
    path.join(__dirname, "Public", "Private", "Administracion", "index.html")
  )
})

//Rutas de end-point
app.use("/api/auth", authRouter)
app.use("/api/productos", productsRouter)
app.use("/api/clientes", clientsRouter)
app.use("/api/ventas", salesRouter)
app.use("/api/mercadopago", mpRouter)
app.use("/api/contact", contactRouter)
app.use("/api/admin", adminRouter)

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
