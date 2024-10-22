import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import { connectDB } from "./config/db.js"
import { productsRouter } from "./routes/products.routes.js"
import { authRouter } from "./routes/auth.router.js"
import { clientsRouter } from "./routes/clients.router.js"
import { salesRouter } from "./routes/sales.router.js"
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

//Rutas de end-point
app.use("/api/auth", authRouter)
app.use("/api/productos", productsRouter)
app.use("/api/clientes", clientsRouter)
app.use("/api/ventas", salesRouter)
// app.use("/api/preference", preferenceRouter)

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





//MERCADOPAGO
  import { createRequire } from 'module'; // Importa createRequire para usar CommonJS
  const require = createRequire(import.meta.url);
  const mercadopago = require('mercadopago'); // Carga MercadoPago usando require


// Ruta para crear una preferencia de pago con Mercado Pago
app.post("/create_preference", (req, res) => {
  const preference = {
    items: [
      {
        title: req.body.title, // Título del producto
        unit_price: parseFloat(req.body.price), // Precio del producto
        quantity: parseInt(req.body.quantity), // Cantidad de productos
      }
    ],
    back_urls: {
      success: "https://www.tusitio.com/success", // URL de éxito
      failure: "https://www.tusitio.com/failure", // URL de fallo
      pending: "https://www.tusitio.com/pending" // URL de pendiente
    },
    auto_return: "approved",
  };

  // Crea la preferencia enviando el access_token directamente
  mercadopago.configure({
    access_token: 'TU_ACCESS_TOKEN' // Reemplazar con mi Access Token de MercadoPago
  });

  mercadopago.preferences.create(preference)
    .then(function(response) {
      res.json({
        id: response.body.id // Envíar el ID de la preferencia al cliente
      });
    }).catch(function(error) {
      console.log(error);
      res.status(500).send("Error creando la preferencia de pago");
    });
});