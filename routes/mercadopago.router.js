import { MercadoPagoConfig, Preference } from "mercadopago"
import { Router } from "express"
import { checkRole, getUserData } from "../middlewares/getUserData.js"
import SalesModel from "../models/sales.model.js"
import ClientModel from "../models/client.model.js"
import { sendMail } from "../config/mailer.js"
const client = new MercadoPagoConfig({
  accessToken: `APP_USR-6508105676111590-102213-8ab833730cadd581130cb361c29e4d4f-2052945142`,
})

const mpRouter = Router()

mpRouter.get("/success", async (req, res) => {
  const sale = await SalesModel.findById(req.query.saleId)
  const client = await ClientModel.findById(sale.cliente)

  const info = await sendMail({
    to: client.email,
    subject: "¡Gracias por su compra!",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: #2c3e50; text-align: center; padding: 20px 0;">¡Gracias por su compra!</h1>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <p style="font-size: 16px;">Le enviamos el comprobante de su compra.</p>
          <p style="font-size: 14px;"><strong>Fecha:</strong> ${sale.fecha}</p>
          <p style="font-size: 16px; margin-top: 20px;"><strong>Productos:</strong></p>
          <ul style="list-style-type: none; padding: 0;">
            ${sale.productos.map(
              (
                producto
              ) => `<li style="padding: 8px 0; border-bottom: 1px solid #dee2e6;">
                ${producto.producto} x ${producto.cantidad}
              </li>`
            )}
          </ul>
          <p style="font-size: 18px; text-align: right; margin-top: 20px;">
            <strong>Total:</strong> $${sale.total}
          </p>
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #2c3e50; font-size: 16px;">¡Gracias por elegirnos!</p>
          <h2 style="color: #2c3e50;">Calimero Hobbies</h2>
          <p style="color: #6c757d; font-size: 12px; margin-top: 20px;">
            Este es un mensaje automático, por favor no responda.
          </p>
        </div>
      </div>
    `,
  })

  if (!info.messageId) {
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Error</title>
        </head>
        <body>
        <script>
          alert("Hubo un error al enviar el comprobante de su compra! Por favor, contacte al administrador.");
        </script>
        </body>
      </html>`)
    return
  }

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

  try {
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

    const body = {
      items,
      back_urls: {
        success:
          "http://localhost:5001/api/mercadopago/success?saleId=" + sale._id,
        failure: "http://localhost:5001/api/mercadopago/failure",
        pending: "http://localhost:5001/api/mercadopago/pending",
      },
      auto_return: "approved",
    }

    const preference = await new Preference(client).create({ body })

    res.json({ redirectUrl: preference.init_point })
  } catch (error) {
    console.error(error)
    res.json(error)
  }
})

export { mpRouter }
