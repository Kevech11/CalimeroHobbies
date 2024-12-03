import { Router } from "express"
import ClientModel from "../models/client.model.js"
import { getUserData, checkRole } from "../middlewares/getUserData.js"
import jwt from "jsonwebtoken"

const clientsRouter = Router()

clientsRouter.use(getUserData)

clientsRouter.put("/:id", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    if (!token) {
      return res.status(401).send("No estas autorizado")
    }

    const payload = jwt.verify(token, "claveSecreta")

    if (!payload._id) {
      return res.status(401).send("No estas autorizado")
    }

    const user = await ClientModel.findById(payload._id)

    if (!user) {
      return res.status(404).send("Usuario no encontrado")
    }

    if (user._id.toString() !== req.params.id) {
      return res.status(401).send("No estas autorizado")
    }

    const { name, lastName, country, province, city, address, phone } = req.body

    const client = await ClientModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        lastName,
        country,
        province,
        city,
        address,
        phone,
      },
      { new: true }
    )

    res.json(client)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

clientsRouter.use(checkRole(["gestion_ventas", "admin"]))

clientsRouter.get("/", async (req, res) => {
  try {
    const clients = await ClientModel.find()
    res.json(clients)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

clientsRouter.post("/", async (req, res) => {
  try {
    const { name, lastName, country, province, city, address, phone } = req.body

    const client = await ClientModel.create({
      name,
      lastName,
      country,
      province,
      city,
      address,
      phone,
    })

    res.json(client)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

clientsRouter.delete("/:id", async (req, res) => {
  try {
    const client = await ClientModel.findByIdAndDelete(req.params.id)
    res.json(client)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export { clientsRouter }
