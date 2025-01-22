import mongoose from "mongoose"

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "cliente",
  },
  password: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  country: {
    type: String,
  },
  province: {
    type: String,
  },
  city: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  resetToken: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
})

const Client = mongoose.model("Client", clientSchema)

export default Client
