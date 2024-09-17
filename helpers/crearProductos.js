async function crearProductos() {
  const data = fs.readFileSync(
    "./Public/Pages/Productos/productos.json",
    "utf-8"
  )
  const productos = JSON.parse(data)

  const productosFormateados = productos.map((producto) => {
    return {
      titulo: producto.titulo,
      imagen: producto.imagen,
      marca: producto.marca,
      categoria: producto.categoria.nombre,
      precio: producto.precio,
    }
  })
  for (const producto of productosFormateados) {
    const nuevoProducto = new ProductModel(producto)
    await nuevoProducto.save()
  }
}
