import { Router } from "express"
import UserModel from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const authRouter = Router()

authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    console.log(req.body)
    // Chequear si el usuario ya está existe en la db
    const user = await UserModel.findOne({ email })
    if (user) {
      return res.status(400).send("El usuario ya existe")
    }
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)
    // Crear el usuario
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    })
    // Devolver el usuario creado sin la password
    delete newUser.password
    res.status(201).json(newUser)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body
  // Chequear si el usuario existe
  try {
    const user = await UserModel.findOne({ email })
    if (!user) {
      return res.status(404).send("Credenciales invalidas")
    }
    // Chequear si la contraseña es correcta
    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(404).send("Credenciales invalidas")
    }
    // Crear el token
    const token = jwt.sign({ _id: user._id }, "claveSecreta")
    // Devolver el token
    res.status(200).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

authRouter.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    if (!token) {
      return res.status(401).send("No estas autorizado")
    }
    const payload = jwt.verify(token, "claveSecreta")
    if (!payload._id) {
      return res.status(401).send("No estas autorizado")
    }
    const user = await UserModel.findById(payload._id)
    res.status(200).json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

export { authRouter }
