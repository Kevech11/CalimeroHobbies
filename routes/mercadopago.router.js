import { MercadoPagoConfig, Preference } from "mercadopago"
import { Router } from "express"
import { checkRole, getUserData } from "../middlewares/getUserData.js"
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
    res.json({ redirectUrl: preference.init_point })
  } catch (error) {
    console.error(error)
    res.json(error)
  }
})

export { mpRouter }
