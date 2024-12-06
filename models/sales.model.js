import mongoose from "mongoose"

const salesSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    default: Date.now,
  },
  cliente: {
    type: String,
    ref: "ClientMayorista",
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
