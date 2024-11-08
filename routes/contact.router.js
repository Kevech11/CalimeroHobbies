import { Router } from "express"
import Contact from "../models/contact.model.js"
import { getUserData, checkRole } from "../middlewares/getUserData.js"

const contactRouter = Router()
contactRouter.use(getUserData)

contactRouter.get(
  "/",
  checkRole(["gestion_ventas", "admin"]),
  async (req, res) => {
    try {
      const messages = await Contact.find()

      res.json(messages)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }
)

contactRouter.post(
  "/send",
  checkRole(["cliente", "gestion_ventas", "admin"]),
  async (req, res) => {
    const { name, email, subject, message } = req.body

    try {
      const newMessage = new Contact({
        name,
        email,
        subject,
        message,
      })

      await newMessage.save()

      res.json({ message: "Mensaje enviado correctamente" })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }
)

export { contactRouter }
