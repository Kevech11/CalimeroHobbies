import { Router } from "express"
import UserModel from "../models/user.model.js"
import ClientModel from "../models/client.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { sendMail } from "../config/mailer.js"

const authRouter = Router()

authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body
    // Chequear si el usuario ya está existe en la db
    const user = await ClientModel.findOne({ email })
    if (user) {
      return res.status(400).send("El usuario ya existe")
    }
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)
    // Crear el usuario
    const newUser = await ClientModel.create({
      name,
      email,
      password: hashedPassword,
    })
    // Devolver el usuario creado sin la password
    delete newUser.password

    await sendMail({
      to: email,
      subject:
        "Bienvenido a Calimero Hobbies, por favor verifica tu email para iniciar sesion",
      html: `<h1>Gracias por registrarte en Calimero Hobbies</h1>
      <p>Para poder iniciar sesion, por favor verifica tu email haciendo click en el siguiente enlace, luego te redireccionara al inicio de sesion</p>
      <a href="http://localhost:5001/api/auth/verify/${newUser._id}">Verificar email</a>`,
    })
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
    let user
    user = await UserModel.findOne({ email })
    if (!user) {
      user = await ClientModel.findOne({
        email,
      })

      if (!user) {
        return res.status(404).send("Credenciales invalidas")
      }
    }

    if (user.role === "client" && !user.isVerified) {
      return res.status(401).send("Usuario no verificado")
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
    const user = await ClientModel.findById(payload._id)
    res.status(200).json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

authRouter.get("/verify/:id", async (req, res) => {
  try {
    const { id } = req.params

    const user = await ClientModel.findById(id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.isVerified = true
    await user.save()

    res.status(200).redirect("http://localhost:5001/Pages/Login")
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Ocurrio un error" })
  }
})

authRouter.post("/recoverypassword", async (req, res) => {
  try {
    const { email } = req.body
    console.log(email)

    const user = await ClientModel.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      "claveSecreta",
      {
        expiresIn: "10m",
      }
    )

    user.resetToken = token
    await user.save()

    const parsedToken = encodeURI(token)

    await sendMail({
      to: user.email,
      subject: "Recuperar contraseña en Calimero Hobbies",
      html: `Solicitaste recuperar tu contraseña en Calimero Hobbies!
      Para recuperarla, hace click en el siguiente enlace y cambia tu contraseña.
      <a href="http://localhost:5001/Pages/confirmar?token=${parsedToken}">Cambiar contraseña</a>
      El enlace expira en 10 minutos!`,
    })

    res.status(200).json({ message: "Email enviado correctamente" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Ocurrio un error" })
  }
})

authRouter.post("/resetpassword", async (req, res) => {
  try {
    const { token, password } = req.body

    const decodedToken = jwt.verify(token, "claveSecreta")

    const user = await ClientModel.findById(decodedToken.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.password = await bcrypt.hash(password, 10)

    await user.save()

    res.status(200).json({ message: "Contraseña cambiada correctamente" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Ocurrio un error" })
  }
})

export { authRouter }
