import { Router } from "express"
import ClientModel from "../models/client.model.js"
import { getUserData, checkRole } from "../middlewares/getUserData.js"

const clientsRouter = Router()

clientsRouter.use(getUserData)
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

clientsRouter.put("/:id", async (req, res) => {
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

    const client = await ClientModel.findByIdAndUpdate(
      req.params.id,
      {
        nombre,
        apellido,
        pais,
        provincia,
        localidad,
        direccion,
        telefono,
      },
      { new: true }
    )

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
