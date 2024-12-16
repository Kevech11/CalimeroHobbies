import { MercadoPagoConfig, Preference } from "mercadopago"
import { Router } from "express"
import { checkRole, getUserData } from "../middlewares/getUserData.js"
import SalesModel from "../models/sales.model.js"
const client = new MercadoPagoConfig({
  accessToken: `APP_USR-6508105676111590-102213-8ab833730cadd581130cb361c29e4d4f-2052945142`,
})

const mpRouter = Router()

mpRouter.get("/success", (req, res) => {
  res.status(200).send(`

    <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Gracias por su compra</title>
        </head>
        <body>
        <script>
          window.localStorage.removeItem('productos-en-carrito'); 
          alert("¡Su compra fue exitosa! Le hemos enviado el comprobante a su correo.");
          window.location.href = "/Productos"; 
        </script>
          
        </body>
      </html>
  `)
})

mpRouter.get("/failure", (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Compra fallida</title>
        </head>
        <body>
          <script>
            alert("¡Compra fallida! Por favor, intente nuevamente.");
            window.location.href = "/Carrito"; 
          </script>
        </body>
      </html>
  `)
})

mpRouter.get("/pending", (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Compra pendiente</title>
        </head>
        <body>
          <script>
            alert("¡Compra pendiente! Por favor, espere la confirmación.");
            window.location.href = "/Home"; 
          </script>
        </body>
      </html>
  `)
})

mpRouter.use(getUserData)
mpRouter.use(
  checkRole(["cliente", "gestion_ventas", "gestion_productos", "admin"])
)

mpRouter.post("/create_preference", async (req, res) => {
  console.log(req.body)
  const items = req.body.map((item) => ({
    title: item.title,
    quantity: item.quantity,
    unit_price: item.price,
    currency_id: "ARS",
  }))
  const body = {
    items,
    back_urls: {
      success: "http://localhost:5001/api/mercadopago/success",
      failure: "http://localhost:5001/api/mercadopago/failure",
      pending: "http://localhost:5001/api/mercadopago/pending",
    },
    auto_return: "approved",
  }
  try {
    const preference = await new Preference(client).create({ body })
    // fecha: {
    //   type: Date,
    //   default: Date.now,
    // },
    // esMayorista: {
    //   type: Boolean,
    //   default: false,
    // },
    // cliente: {
    //   type: String,
    //   ref: "ClientMayorista",
    // },
    // paymentMethod: {
    //   type: String,
    //   enum: ["efectivo", "tarjeta", "transferencia"],
    //   required: true,
    // },
    // productos: [
    //   {
    //     producto: {
    //       type: String,
    //       ref: "Product",
    //     },
    //     cantidad: {
    //       type: Number,
    //       required: true,
    //     },
    //   },
    // ],
    // total: {
    //   type: Number,
    //   required: true,
    // },
    // Registrar la venta
    // LA ESTA REGISTRANDO AUNQUE NO SE COMPLETA LA COMPRA
    // NO SE ESTA ACTUALIZANDO EL STOCK
    console.log(preference)
    const sale = new SalesModel({
      fecha: new Date(),
      esMayorista: false,
      cliente: req.user._id,
      paymentMethod: "tarjeta",
      productos: req.body.map((item) => ({
        producto: item.product_id,
        cantidad: item.quantity,
      })),
      total: req.body.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
    })

    await sale.save()
    res.json({ redirectUrl: preference.init_point })
  } catch (error) {
    console.error(error)
    res.json(error)
  }
})

export { mpRouter }
