const clientsInput = document.getElementById("cliente")
const productsInput = document.getElementById("productos")
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

async function cargarVentas() {
  try {
    const ventasTable = document.getElementById("ventasTable")
    ventasTable.innerHTML = `
      <tr>
        <th>Fecha</th>
        <th>Cliente</th>
        <th>Producto</th>
        <th>Total</th>
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
      ).textContent = `${venta.cliente.nombre} ${venta.cliente.apellido}`
      newRow.insertCell(
        2
      ).innerHTML = `<button type="button" class="btn btn-primary">Ver productos</button>`
      newRow.insertCell(3).textContent = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2,
      }).format(venta.total)

      newRow.cells[2]
        .querySelector("button")
        .addEventListener("click", function () {
          const width = 600
          const height = 400
          const left = window.screen.width / 2 - width / 2
          const top = window.screen.height / 2 - height / 2

          // Guardar los productos para utilizarlos luego
          productosVenta = venta.productos

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
                  table { width: 100%; border-collapse: collapse; }
                  th, td { border: 1px solid black; padding: 8px; text-align: left; }
                  th { background-color: #f2f2f2; }
                  .center { text-align: center; }
                  .right { text-align: right; }
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
          ventasTable.deleteRow(newRow.rowIndex - 1)
        }
      })

      const printButton = document.createElement("button")
      printButton.textContent = "Imprimir"
      printButton.className = "btn-print"
      actionsCell.appendChild(printButton)

      printButton.addEventListener("click", function () {
        const ventaInfo = `
          <h2 style="text-align:center;">
            <span style="color:red;">C</span><span style="color:blue;">ALIMERO </span>
            <span style="color:red;">H</span><span style="color:blue;">OBBIES</span>
          </h2>
          <table style="margin: 0 auto; border-collapse: collapse; text-align: center;">
            <thead>
              <tr>
                <th style="border: 1px solid black; padding: 8px;">Fecha</th>
                <th style="border: 1px solid black; padding: 8px;">Cliente</th>
                <th style="border: 1px solid black; padding: 8px;">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid black; padding: 8px; font-weight:bold;">
                  ${new Date(venta.fecha).toLocaleDateString()}
                </td>
                <td style="border: 1px solid black; padding: 8px; font-weight:bold;">
                  ${venta.cliente.nombre} ${venta.cliente.apellido}
                </td>
                <td style="border: 1px solid black; padding: 8px; font-weight:bold;">
                  $${venta.total}
                </td>
              </tr>
            </tbody>
          </table>
          
          <h3 style="text-align:center;">Productos</h3>
          <table style="margin: 0 auto; border-collapse: collapse; text-align: center;">
            <thead>
              <tr>
                <th style="border: 1px solid black; padding: 8px;">Producto</th>
                <th style="border: 1px solid black; padding: 8px;">Precio</th>
              </tr>
            </thead>
            <tbody>
              ${productosVenta
                .map(
                  (producto) =>
                    `<tr>
                      <td style="border: 1px solid black; padding: 8px; font-weight:bold;">${producto.titulo}</td>
                      <td style="border: 1px solid black; padding: 8px; font-weight:bold;">$${producto.precio}</td>
                    </tr>`
                )
                .join("")}
            </tbody>
          </table>
        `

        const win = window.open("", "", "height=600,width=800")
        win.document.write(
          "<html><head><title>Imprimir Venta</title></head><body>"
        )
        win.document.write(ventaInfo)
        win.document.write("</body></html>")
        win.document.close()
        win.print()
      })

      const editButton = document.createElement("button")
      editButton.textContent = "Editar"
      editButton.className = "btn-edit"
      actionsCell.appendChild(editButton)

      editButton.addEventListener("click", function () {
        if (editButton.textContent === "Editar") {
          for (let i = 0; i < 5; i++) {
            const cell = newRow.cells[i]
            const input = document.createElement("input")
            input.type = "text"
            input.value = cell.textContent
            cell.textContent = ""
            cell.appendChild(input)
          }
          editButton.textContent = "Guardar"
        } else {
          for (let i = 0; i < 5; i++) {
            const cell = newRow.cells[i]
            const input = cell.querySelector("input")
            cell.textContent = input.value
          }
          editButton.textContent = "Editar"
        }
      })
    })
  } catch (error) {
    console.error("Error fetching ventas:", error)
  }
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
  const response = await fetch("/api/clientes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  })

  if (response.status === 403) {
    window.location.href = "/home"
  }
  return await response.json()
}

async function getProducts() {
  const response = await fetch("/api/productos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  })
  return await response.json()
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
    option.textContent = `${client.nombre} ${client.apellido}`
    clientsInput.appendChild(option)
  })

  const products = await getProducts()

  products.forEach((product) => {
    const option = document.createElement("option")
    option.value = product._id
    option.textContent = product.titulo
    option.dataset.precio = product.precio
    option.dataset.cantidad = 1
    productsInput.appendChild(option)
  })
})

ventaForm.addEventListener("submit", async function (event) {
  event.preventDefault() 
  // Obtener los valores de los campos, incluyendo el nuevo campo de fecha
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
    loginBtn.innerHTML = `<a class="btn btn-primary" onclick='window.localStorage.removeItem("user"); window.location.reload();'>Cerrar sesion</a>`
  } else {
    loginBtn.innerHTML = `<a href="/login" class="btn btn-primary">Iniciar sesion</a>`
  }
}
