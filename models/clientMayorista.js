import mongoose from "mongoose"

const clientMayoristaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "cliente",
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
})

const ClientMayorista = mongoose.model("ClientMayorista", clientMayoristaSchema)

export default ClientMayorista
