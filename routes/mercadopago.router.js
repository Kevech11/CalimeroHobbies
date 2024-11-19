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
      failure: "http://localhost:5001/failure",
      pending: "http://localhost:5001/pending",
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



mpRouter.get("/success", (req, res) => {
  res.status(200).send(`
    <script>
      alert("¡Su compra fue exitosa! Le hemos enviado el comprobante a su correo.");
      localStorage.removeItem('cart'); 
      window.location.href = "/Public/Pages/Productos/index.html"; 
    </script>
  `);
});

export { mpRouter }
