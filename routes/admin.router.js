import { Router } from "express"
import UserModel from "../models/user.model.js"
import ClientModel from "../models/client.model.js"
import bcrypt from "bcrypt"
import { getUserData, checkRole } from "../middlewares/getUserData.js"

const adminRouter = Router()

adminRouter.use(getUserData)
adminRouter.use(checkRole("admin"))

adminRouter.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find()
    const clients = await ClientModel.find()
    res.status(200).send([...users, ...clients])
  } catch (error) {
    res.status(500).send(error.message)
  }
})

adminRouter.post("/new-user", async (req, res) => {
  const { name, email, password, role } = req.body
  console.log(req.body)

  try {
    const user = await UserModel.findOne({ email })
    if (user) {
      return res.status(400).send("User already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role,
    })
    await newUser.save()
    res.status(201).send("User created successfully")
  } catch (error) {
    res.status(500).send(error.message)
  }
})

adminRouter.delete("/delete-user/:id", async (req, res) => {
  const { id } = req.params

  try {
    await UserModel.findByIdAndDelete(id)
    res.status(200).send("User deleted successfully")
  } catch (error) {
    res.status(500).send(error.message)
  }
})

export { adminRouter }
