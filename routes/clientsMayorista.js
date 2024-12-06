import { Router } from "express"
import ClientMayorista from "../models/clientMayorista.js"

const clientsMayoristaRouter = Router()

clientsMayoristaRouter.get("/", async (req, res) => {
  try {
    const clients = await ClientMayorista.find()
    res.status(200).json(clients)
  } catch (error) {
    res.status(500).json(error)
  }
})

clientsMayoristaRouter.post("/", async (req, res) => {
  try {
    console.log(req.body)
    const client = await ClientMayorista.create(req.body)
    res.status(201).json(client)
  } catch (error) {
    res.status(500).json(error)
  }
})

clientsMayoristaRouter.put("/:id", async (req, res) => {
  try {
    const client = await ClientMayorista.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.status(200).json(client)
  } catch (error) {
    res.status(500).json(error)
  }
})

clientsMayoristaRouter.delete("/:id", async (req, res) => {
  try {
    await ClientMayorista.findByIdAndDelete(req.params.id)
    res.status(200).json("Client deleted")
  } catch (error) {
    res.status(500).json(error)
  }
})

export default clientsMayoristaRouter
