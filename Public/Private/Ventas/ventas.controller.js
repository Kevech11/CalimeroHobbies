const clientsInput = document.getElementById("cliente")
const productsInput = document.getElementById("productos")
const categoriesInput = document.getElementById("categoria")
const selectedProductsElement = document.getElementById("selected-products")
let selectedProducts = []
const loginBtn = document.getElementById("loginBtn")

function sumarUnProducto(id) {
  selectedProducts.find((product) => {
    if (product.id === id) {
      parseInt(product.cantidad++)
      product.total = product.precio * product.cantidad
    }
  })
}

function restarUnProducto(id) {
  selectedProducts.find((product) => {
    if (product.id === id) {
      parseInt(product.cantidad--)
      product.total = product.precio * product.cantidad
    }
  })
}

function imprimitVenta(venta) {
  const productosOrdenados = venta.productos.sort((a, b) =>
    a.producto.titulo.localeCompare(b.producto.titulo)
  )

  const ventaInfo = `
  <div style="font-family: 'Nunito Sans', sans-serif; width: 600px; margin: 0 auto; border: 1px solid black; padding: 16px;">
    <!-- Encabezado -->
    <header style="text-align: center; border-bottom: 2px solid black; padding-bottom: 10px;">
      <h1 style="margin: 0;">
        <span style="color:red;">C</span><span style="color:blue;">alimero </span>
        <span style="color:red;">H</span><span style="color:blue;">obby</span>
      </h1>
      <p style="margin: 5px 0;">RUC: 1234567890 - Dirección: Dean Funes 250</p>
      <p style="margin: 5px 0;">Teléfono: (351) 371-9898 - Email: calimerohobby@gmail.com</p>
    </header>

    <!-- Datos de la venta -->
    <section style="margin: 16px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 8px; font-weight: bold;">Fecha:</th>
            <td style="padding: 8px;">${new Date(
              venta.fecha
            ).toLocaleDateString()}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px; font-weight: bold;">Cliente:</th>
            <td style="padding: 8px;">${venta.cliente.name} ${
    venta.cliente.lastName
  }</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px; font-weight: bold;">Total:</th>
            <td style="padding: 8px;">${new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(venta.total)}</td>
          </tr>
        </thead>
      </table>
    </section>

    <!-- Tabla de productos -->
    <h3 style="text-align:center; margin-top: 16px; margin-bottom: 10px;">Detalle de Productos</h3>
    <table style="width: 100%; border-collapse: collapse; text-align: center;">
      <thead>
        <tr>
          <th style="border: 1px solid black; padding: 8px;">Producto</th>
          <th style="border: 1px solid black; padding: 8px;">Precio</th>
          <th style="border: 1px solid black; padding: 8px;">Cantidad</th>
          <th style="border: 1px solid black; padding: 8px;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${venta.productos
          .map(
            ({ producto, cantidad }) => `
              <tr>
                <td style="border: 1px solid black; padding: 8px;">${
                  producto.titulo
                }</td>
                <td style="border: 1px solid black; padding: 8px;">${new Intl.NumberFormat(
                  "es-AR",
                  { style: "currency", currency: "ARS" }
                ).format(producto.precio)}</td>
                <td style="border: 1px solid black; padding: 8px;">${cantidad}</td>
                <td style="border: 1px solid black; padding: 8px;">${new Intl.NumberFormat(
                  "es-AR",
                  { style: "currency", currency: "ARS" }
                ).format(cantidad * producto.precio)}</td>
              </tr>`
          )
          .join("")}
      </tbody>
    </table>

    <!-- Pie de página -->
    <footer style="text-align: center; border-top: 2px solid black; margin-top: 16px; padding-top: 10px;">
      <p style="margin: 0;">Gracias por su compra en <strong>Calimero Hobby</strong>.</p>
      <p style="margin: 5px 0;">¡Vuelva pronto!</p>
    </footer>
  </div>
`

  const win = window.open("", "", "height=600,width=800")
  win.document.write("<html><head><title>Imprimir Venta</title></head><body>")
  win.document.write(ventaInfo)
  win.document.write("</body></html>")
  win.document.close()
  win.print()
}

//Mostrar venta en la tabla
async function cargarVentas() {
  try {
    const ventasTable = document.getElementById("ventasTable")
    ventasTable.innerHTML = `
      <tr>
        <th>Fecha</th>
        <th>Cliente</th>
        <th>Producto</th>
        <th style="text-align: right;">Total</th> <!-- Encabezado alineado -->
        <th>Acciones</th>
      </tr>
    `
    const response = await fetch("/api/ventas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    })

    if (response.status === 403) {
      window.location.href = "/home"
    }

    const ventas = await response.json()
    console.log(ventas)

    ventas.forEach((venta) => {
      let productosVenta = [] // Para almacenar los productos

      const newRow = ventasTable.insertRow()
      newRow.insertCell(0).textContent = new Date(
        venta.fecha
      ).toLocaleDateString()
      newRow.insertCell(
        1
      ).textContent = `${venta.cliente.name} ${venta.cliente.lastName}`
      newRow.insertCell(
        2
      ).innerHTML = `<button type="button" class="btn btn-primary">Ver productos</button>`

      const totalCell = newRow.insertCell(3)
      totalCell.textContent = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2,
      }).format(venta.total)
      totalCell.style.textAlign = "right" // Aplica el estilo en línea

      newRow.cells[2]
        .querySelector("button")
        .addEventListener("click", function () {
          const width = 600
          const height = 400
          const left = window.screen.width / 2 - width / 2
          const top = window.screen.height / 2 - height / 2

          const productosVenta = venta.productos.sort((a, b) =>
            a.producto.titulo.localeCompare(b.producto.titulo)
          )

          let win = window.open(
            "",
            "",
            `height=${height},width=${width},top=${top},left=${left}`
          )

          // Crear el contenido HTML con una tabla
          win.document.write(`
            <html>
              <head>
                <title>Productos</title>
                <style>
                  @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&display=swap');
                  body {
                    font-family: 'Nunito Sans', sans-serif;
                    margin: 20px;
                  }
                  table { 
                    width: 100%; 
                    border-collapse: collapse; 
                  }
                  th, td { 
                    border: 1px solid black; 
                    padding: 8px; 
                    text-align: left; 
                  }
                  th { 
                    background-color: #f2f2f2; 
                  }
                  .center { 
                    text-align: center; 
                  }
                  .right { 
                    text-align: right; 
                  }
                </style>
              </head>
              <body>
                <h2>Lista de Productos</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th class="right">Precio</th>
                      <th class="center">Cantidad</th>
                      <th class="right">Total</th>
                    </tr>
                  </thead>
                  <tbody>`)

          // Añadir los productos a la tabla
          productosVenta.forEach(({ producto, cantidad }) => {
            win.document.write(`
              <tr>
                <td>${producto.titulo}</td>
                <td class="right">$ ${producto.precio.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}</td>
                <td class="center">${cantidad}</td>
                <td class="right">$ ${(
                  producto.precio * cantidad
                ).toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}</td>
              </tr>`)
          })

          win.document.write(`</tbody></table></body></html>`)
          win.document.close()

          win.onunload = function () {
            win = null
          }
        })

      const actionsCell = newRow.insertCell(4)

      const deleteButton = document.createElement("button")
      deleteButton.textContent = "Eliminar"
      deleteButton.className = "btn-delete"
      actionsCell.appendChild(deleteButton)

      deleteButton.addEventListener("click", function () {
        if (confirm("¿Estás seguro de que deseas eliminar esta venta?")) {
          const deleted = eliminarVenta(venta._id)
          if (deleted) {
            ventasTable.deleteRow(newRow.rowIndex)
          } else {
            alert("No se pudo eliminar la venta")
          }
        }
      })

      const printButton = document.createElement("button")
      printButton.textContent = "Imprimir"
      printButton.className = "btn-print"
      actionsCell.appendChild(printButton)

      console.log(ventas)
      printButton.addEventListener("click", () => imprimitVenta(venta))
    })
  } catch (error) {
    console.error("Error fetching ventas:", error)
  }
}

async function eliminarVenta(id) {
  const response = await fetch(`/api/ventas/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  })

  if (response.status === 200) {
    return true
  }
  return false
}

productsInput.addEventListener("change", function () {
  const selectedProduct = productsInput.options[productsInput.selectedIndex]
  const product = {
    id: selectedProduct.value,
    titulo: selectedProduct.text,
    precio: parseInt(selectedProduct.dataset.precio),
    cantidad: parseInt(selectedProduct.dataset.cantidad),
    total: parseInt(
      selectedProduct.dataset.precio * selectedProduct.dataset.cantidad
    ),
  }
  selectedProducts.push(product)

  selectedProductsElement.innerHTML += `
    <li>
      <div class="titulo">
        <span>${product.titulo} - $${product.precio}</span>
      </div>
      <span style="color: red;" id="cantidad-${product.id}">${product.cantidad}</span>
      <div class="buttons">
      <button type="button" class="sumar" data-id="sumar-${product.id}">+</button>
      <button type="button" class="restar" data-id="restar-${product.id}">-</button>
      </div>
    </li>
  `
  actualizarTotal()

  // Capturar todos los botones de sumar y restar nuevamente
  const sumarButtons = document.querySelectorAll(".sumar")
  const restarButtons = document.querySelectorAll(".restar")

  sumarButtons.forEach((sumarButton) => {
    sumarButton.addEventListener("click", function () {
      const id = sumarButton.dataset.id.split("-")[1]
      const product = selectedProducts.find((product) => product.id === id)
      sumarUnProducto(id)
      actualizarTotal()
      const cantidad = document.getElementById(`cantidad-${id}`)
      cantidad.textContent = parseInt(product.cantidad)
    })
  })

  restarButtons.forEach((restarButton) => {
    restarButton.addEventListener("click", function () {
      const id = restarButton.dataset.id.split("-")[1]
      const product = selectedProducts.find((product) => product.id === id)
      if (product.cantidad === 1) {
        const index = selectedProducts.findIndex((product) => product.id === id)
        selectedProducts.splice(index, 1)
        document.querySelector("#cantidad-" + id).parentElement.remove()
        actualizarTotal()
        return
      }
      restarUnProducto(id)
      actualizarTotal()
      const cantidad = document.getElementById(`cantidad-${id}`)
      if (product.cantidad) {
        cantidad.textContent = parseInt(product.cantidad)
      }
    })
  })
})

async function getClients() {
  const response = await fetch("/api/clientesmayorista", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  })

  if (response.status === 403) {
    window.location.href = "/home"
  }

  const clients = await response.json()
  console.log(clients)

  // Ordenar alfabéticamente por el nombre del cliente
  clients.sort((a, b) => a.name.localeCompare(b.name))
  return clients
}

async function getProducts() {
  const response = await fetch("/api/productos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  })
}

function actualizarTotal() {
  const total = selectedProducts.reduce(
    (acc, product) => acc + product.total,
    0
  )

  const formatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  })

  const totalElement = document.getElementById("total")
  totalElement.textContent = formatter.format(total)
}

document.addEventListener("DOMContentLoaded", async function () {
  const clients = await getClients()
  const sales = await cargarVentas()

  clients.forEach((client) => {
    const option = document.createElement("option")
    option.value = client._id
    option.textContent = `${client.name} ${client.lastName}`
    clientsInput.appendChild(option)
  })
})

categoriesInput.addEventListener("change", async function () {
  const categoryId = categoriesInput.value

  const response = await fetch(`/api/productos/categoria/${categoryId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  })

  let products = await response.json()
  products = products.sort((a, b) => a.titulo.localeCompare(b.titulo))

  productsInput.innerHTML = ""
  products.forEach((product) => {
    const option = document.createElement("option")
    option.value = product._id
    option.textContent = product.titulo
    option.dataset.precio = product.precio
    option.dataset.cantidad = 1
    productsInput.appendChild(option)
  })
})

//capturar venta
ventaForm.addEventListener("submit", async function (event) {
  event.preventDefault()

  const fecha = document.getElementById("fecha").value
  const cliente = document.getElementById("cliente").value
  const total = selectedProducts.reduce(
    (acc, product) => acc + product.total,
    0
  )

  const dataToSend = {
    fecha,
    cliente,
    productos: selectedProducts.map((product) => ({
      producto: product.id,
      cantidad: product.cantidad,
    })),
    total,
  }

  const response = await fetch("/api/ventas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
    body: JSON.stringify(dataToSend),
  })

  const data = await response.json()

  if (response.status === 201) {
    ventaForm.reset()
    selectedProductsElement.innerHTML = ""
    selectedProducts = []
    actualizarTotal()
    cargarVentas()
  }
})

if (loginBtn) {
  if (window.localStorage.getItem("user")) {
    loginBtn.innerHTML = `<a class="btn btn-primary" onclick='window.localStorage.removeItem("user");window.localStorage.removeItem("token"); window.location.reload();'>Cerrar sesion</a>`
  } else {
    loginBtn.innerHTML = `<a href="/login" class="btn btn-primary">Iniciar sesion</a>`
  }
}
