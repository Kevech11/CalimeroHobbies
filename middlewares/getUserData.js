import jwt from "jsonwebtoken"
import UserModel from "../models/user.model.js"

export async function getUserData(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const userData = jwt.verify(token, "claveSecreta")
    if (!userData) {
      return res.status(401).send("No autorizado")
    }

    const user = await UserModel.findById(userData._id)
    req.user = user
    next()
  } catch (error) {
    console.error(error)
    res.status(403).send("No autorizado")
  }
}

export const checkRole = (role) => (req, res, next) => {
  if (!role.includes(req.user.role)) {
    return res.status(403).send("No autorizado")
  }
  next()
}
