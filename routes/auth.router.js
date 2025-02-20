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
      subject: "Bienvenido a Calimero Hobby, verifica tu email para iniciar sesión",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
          <div style="background-color: #ffffff; padding: 25px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); text-align: center;">
            <h1 style="color:rgb(31, 31, 78); margin-bottom: 10px;">¡Bienvenido a Calimero Hobby!</h1>
            <p style="font-size: 16px; color: #555;">Gracias por registrarte en <strong>Calimero Hobby</strong>. Para completar tu registro y comenzar a comprar, verifica tu email.</p>
            
            <a href="http://localhost:5001/api/auth/verify/${newUser._id}" 
               style="display: inline-block; background-color:rgb(31, 31, 78); color: #ffffff; text-decoration: none; padding: 12px 20px; font-size: 16px; font-weight: bold; border-radius: 5px; margin-top: 15px;">
              Verificar email
            </a>
    
            <p style="margin-top: 20px; font-size: 14px; color: #777;">Al hacer clic en el enlace, serás redirigido a la página de inicio de sesión.</p>
          </div>
    
          <div style="text-align: center; margin-top: 20px;">
            <h3 style="color:rgb(31, 31, 78); margin-bottom: 5px;">Calimero Hobby</h3>
            <p style="color: #777; font-size: 12px;">Este es un mensaje automático, por favor no respondas.</p>
          </div>
        </div>
      `,
    });
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

    if (user.role === "cliente" && !user.isVerified) {
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
      subject: "Recuperar contraseña en Calimero Hobby",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
          <div style="background-color: #ffffff; padding: 25px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); text-align: center;">
            <h2 style="color:rgb(31, 31, 78); margin-bottom: 10px;">Recuperación de contraseña</h2>
            <p style="font-size: 16px; color: #555;">Solicitaste recuperar tu contraseña en <strong>Calimero Hobby</strong>.</p>
            <p style="font-size: 14px; color: #777;">Para establecer una nueva contraseña, haz clic en el siguiente botón:</p>
    
            <a href="http://localhost:5001/Pages/confirmar?token=${parsedToken}" 
               style="display: inline-block; background-color:rgb(31, 31, 78); color: #ffffff; text-decoration: none; padding: 12px 20px; font-size: 16px; font-weight: bold; border-radius: 5px; margin-top: 15px;">
              Cambiar contraseña
            </a>
    
            <p style="margin-top: 20px; font-size: 14px; color: #777;">Este enlace expira en <strong>10 minutos</strong>. Si no solicitaste este cambio, ignora este mensaje.</p>
          </div>
    
          <div style="text-align: center; margin-top: 20px;">
            <h3 style="color:rgb(31, 31, 78); margin-bottom: 5px;">Calimero Hobby</h3>
            <p style="color: #777; font-size: 12px;">Este es un mensaje automático, por favor no respondas.</p>
          </div>
        </div>
      `,
    });

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
