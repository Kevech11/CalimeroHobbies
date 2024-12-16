import mongoose from "mongoose"

const salesSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    default: Date.now,
  },
  esMayorista: {
    type: Boolean,
    default: false,
  },
  cliente: {
    type: String,
    refPath: 'clienteModel'
  },
  clienteModel: {
    type: String,
    required: true,
    enum: ['Client', 'ClientMayorista'],
    default: function() {
      return this.esMayorista ? 'ClientMayorista' : 'Client'
    }
  },
  paymentMethod: {
    type: String,
    enum: ["efectivo", "tarjeta", "transferencia"],
    required: true,
  },
  productos: [
    {
      producto: {
        type: String,
        ref: "Product",
      },
      cantidad: {
        type: Number,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
})

const Sale = mongoose.model("Sale", salesSchema)

export default Sale
