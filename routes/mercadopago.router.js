import { MercadoPagoConfig, Preference } from "mercadopago"
import { Router } from "express"
import { checkRole, getUserData } from "../middlewares/getUserData.js"
const client = new MercadoPagoConfig({
  accessToken: `APP_USR-6508105676111590-102213-8ab833730cadd581130cb361c29e4d4f-2052945142`,
})

const mpRouter = Router()

mpRouter.use(getUserData)
mpRouter.use(
  checkRole(["cliente", "gestion_ventas", "gestion_productos", "admin"])
)

mpRouter.post("/create_preference", async (req, res) => {
  const body = {
    items: [
      {
        title: req.body.title,
        quantity: Number(req.body.quantity),
        unit_price: Number(req.body.price),
        currency_id: "ARS",
      },
    ],
    back_urls: {
      success: "/http://localhost:5001/success",
      failure: "/http://localhost:5001/failure",
      pending: "/http://localhost:5001/pending",
    },
    auto_return: "approved",
  }
  try {
    const preference = await new Preference(client).create({ body })
    console.log(preference)
    res.json({ redirectUrl: preference.init_point })
  } catch (error) {
    res.json(error)
  }
})

export { mpRouter }
