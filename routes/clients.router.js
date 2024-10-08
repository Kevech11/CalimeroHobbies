import { Router } from "express"
import ClientModel from "../models/client.model.js"

const clientsRouter = Router()

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
    const {
      nombre,
      apellido,
      pais,
      provincia,
      localidad,
      direccion,
      telefono,
    } = req.body

    const client = await ClientModel.create({
      nombre,
      apellido,
      pais,
      provincia,
      localidad,
      direccion,
      telefono,
    })

    res.json(client)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export { clientsRouter }
