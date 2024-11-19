import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  imagen: {
    type: String,
    required: false,
  },
  marca: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
})

const Product = mongoose.model("Product", productSchema)

export default Product
