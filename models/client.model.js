import mongoose from "mongoose"

const clientSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  pais: {
    type: String,
    required: true,
  },
  provincia: {
    type: String,
    required: true,
  },
  localidad: {
    type: String,
    required: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },
})

const Client = mongoose.model("Client", clientSchema)

export default Client
