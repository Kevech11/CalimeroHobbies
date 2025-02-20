import { MercadoPagoConfig, Preference } from "mercadopago"
import { Router } from "express"
import { checkRole, getUserData } from "../middlewares/getUserData.js"
import SalesModel from "../models/sales.model.js"
import ClientModel from "../models/client.model.js"
import ProductModel from "../models/products.model.js"
import { sendMail } from "../config/mailer.js"
const client = new MercadoPagoConfig({
  accessToken: `APP_USR-6508105676111590-102213-8ab833730cadd581130cb361c29e4d4f-2052945142`,
})

const mpRouter = Router()

mpRouter.get("/success", async (req, res) => {
  const sale = await SalesModel.findById(req.query.saleId)
  const client = await ClientModel.findById(sale.cliente)
  const products = await ProductModel.find({
    _id: { $in: sale.productos.map((item) => item.producto) },
  })

  const generateTrackingCode = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const prefix = Array(2)
      .fill()
      .map(() => letters[Math.floor(Math.random() * letters.length)])
      .join("")
    const suffix = Array(2)
      .fill()
      .map(() => letters[Math.floor(Math.random() * letters.length)])
      .join("")
    const numbers = Array(8)
      .fill()
      .map(() => Math.floor(Math.random() * 10))
      .join("")
    return `${prefix}-${numbers}-${suffix}`
  }

  const trackingCode = generateTrackingCode()

  const info = await sendMail({
    to: client.email,
    subject: "¡Gracias por su compra!",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Arial', sans-serif; color: #333; background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
        <div style="background-color: #ffffff; padding: 25px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
          <h1 style="color:rgb(31, 31, 78); text-align: center; font-size: 24px; margin-bottom: 10px;">¡Gracias por tu compra!</h1>
          <p style="text-align: center; font-size: 16px; color: #555;">Aquí tienes los detalles de tu pedido.</p>
          
          <div style="border-top: 2px solidrgb(31, 31, 78); margin: 20px 0; padding-top: 15px;">
            <p style="font-size: 14px;"><strong>Fecha:</strong> ${new Date(sale.fecha).toLocaleDateString()}</p>
          </div>
  
          <h3 style="color:rgb(31, 31, 78); margin-bottom: 10px;">Productos adquiridos:</h3>
          <ul style="list-style-type: none; padding: 0;">
            ${sale.productos
              .map((producto) => {
                const product = products.find((p) => p._id.toString() === producto.producto.toString());
                return `
                  <li style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                    <div style="flex-grow: 1;">
                      <p style="margin: 0; font-size: 16px; font-weight: bold;">${product ? product.titulo : "Producto no encontrado"}</p>
                      <p style="margin: 0; font-size: 14px; color: #777;">Cantidad: ${producto.cantidad}</p>
                    </div>
                    <p style="margin: 0; font-size: 16px; font-weight: bold; color:rgb(31, 31, 78);">$${producto.cantidad * (product ? product.precio : 0)}</p>
                  </li>
                `;
              })
              .join("")}
          </ul>
  
          <p style="font-size: 20px; text-align: right; margin-top: 20px; font-weight: bold; color: #333;">
            Total: <span style="color:rgb(31, 31, 78);">$${sale.total}</span>
          </p>
  
          <div style="border-top: 2px solid rgb(31, 31, 78); margin: 20px 0; padding-top: 15px;">
            <p style="font-size: 16px;"><strong>Código de seguimiento del envio:</strong> <span style="color:rgb(31, 31, 78);">${trackingCode}</span></p>
          </div>
        </div>
  
        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #333; font-size: 16px;">¡Gracias por elegirnos!</p>
          <h2 style="color:rgb(31, 31, 78);">Calimero Hobby</h2>
          <p style="color: #777; font-size: 12px; margin-top: 10px;">
            Este es un mensaje automático, por favor no respondas.
          </p>
        </div>
      </div>
    `,
  });

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
