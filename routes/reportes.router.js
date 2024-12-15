import mongoose from "mongoose";
import Product from "../models/products.model.js"; // Modelo de productos
import Sale from "../models/sales.model.js"; // Modelo de ventas

export const obtenerProductosMasVendidos = async (req, res) => {
  try {
    const productosMasVendidos = await Sale.aggregate([
      { $unwind: "$productos" }, // Desglosar productos en las ventas
      {
        $group: {
          _id: "$productos.producto", // Agrupar por ID del producto
          cantidad: { $sum: "$productos.cantidad" }, // Sumar la cantidad vendida
        },
      },
      { $sort: { cantidad: -1 } }, // Ordenar descendente
      { $limit: 5 }, // Limitar a los 5 más vendidos
      {
        $lookup: {
          from: "products", // Conectar con la colección de productos
          localField: "_id",
          foreignField: "_id",
          as: "productoInfo",
        },
      },
      { $unwind: "$productoInfo" },
      {
        $project: {
          nombre: "$productoInfo.nombre",
          cantidad: 1,
        },
      },
    ]);

    res.json(productosMasVendidos);
  } catch (error) {
    console.error("Error al obtener productos más vendidos", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};