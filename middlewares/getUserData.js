import jwt from "jsonwebtoken"
import UserModel from "../models/user.model.js"

export async function getUserData(req, res, next) {
  const token = req.headers.authorization.split(" ")[1]
  const userData = jwt.verify(token, "claveSecreta")
  if (!userData) {
    return res.status(401).send("No autorizado")
  }

  const user = await UserModel.findById(userData._id)
  req.user = user
  next()
}
