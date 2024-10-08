const clientsInput = document.getElementById("cliente")
const productsInput = document.getElementById("productos")
const selectedProductsElement = document.getElementById("selected-products")
const selectedProducts = []
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

  console.log(selectedProducts)
  selectedProductsElement.innerHTML += `
    <li>
      <span>${product.titulo} - ${product.precio}</span>
      <span style="color: red;" id="cantidad-${product.id}">${product.cantidad}</span>
      <button type="button" class="sumar" data-id="sumar-${product.id}">+</button>
      <button type="button" class="restar" data-id="restar-${product.id}">-</button>
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
      if (product.cantidad === 1) return
      // CUANTO LA CANTIDAD ES 1 DEBE ELMINAR EL PRODUCTO
      restarUnProducto(id)
      actualizarTotal()
      const cantidad = document.getElementById(`cantidad-${id}`)
      cantidad.textContent = parseInt(product.cantidad)
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
  console.log(selectedProducts)
  const total = selectedProducts.reduce(
    (acc, product) => acc + product.total,
    0
  )
  console.log(total)
  const totalElement = document.getElementById("total")
  totalElement.textContent = total
}

document.addEventListener("DOMContentLoaded", async function () {
  const clients = await getClients()

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

ventaForm.addEventListener("submit", function (event) {
  event.preventDefault() // Prevenir el envío del formulario

  // Obtener los valores de los campos, incluyendo el nuevo campo de fecha
  const fecha = document.getElementById("fecha").value
  const cliente = document.getElementById("cliente").value
  const producto = document.getElementById("productos").value
  const total = document.getElementById("total").value

  // Crear una nueva fila y agregar los valores, incluyendo la fecha
  const newRow = ventasTable.insertRow()
  //newRow.insertCell(0).textContent = IdPedido;
  newRow.insertCell(0).textContent = fecha
  newRow.insertCell(1).textContent = cliente
  newRow.insertCell(2).textContent = producto
  newRow.insertCell(3).textContent = total

  // Crear celda de acciones
  const actionsCell = newRow.insertCell(4)

  // Botón de eliminar
  const deleteButton = document.createElement("button")
  deleteButton.textContent = "Eliminar"
  deleteButton.className = "btn-delete"
  actionsCell.appendChild(deleteButton)

  deleteButton.addEventListener("click", function () {
    if (confirm("¿Estás seguro de que deseas eliminar esta venta?")) {
      ventasTable.deleteRow(newRow.rowIndex - 1)
    }
  })

  // Botón de imprimir
  const printButton = document.createElement("button")
  printButton.textContent = "Imprimir"
  printButton.className = "btn-print"
  actionsCell.appendChild(printButton)

  printButton.addEventListener("click", function () {
    const ventaInfo = `
            Fecha: ${fecha}
            Cliente: ${cliente}
            Productos: ${producto}
            Total: ${total}
        `
    const win = window.open("", "", "height=400,width=600")
    win.document.write("<html><head><title>Imprimir Venta</title></head><body>")
    win.document.write("<pre>" + ventaInfo + "</pre>")
    win.document.write("</body></html>")
    win.document.close()
    win.print()
  })

  // Botón de editar
  const editButton = document.createElement("button")
  editButton.textContent = "Editar"
  editButton.className = "btn-edit"
  actionsCell.appendChild(editButton)

  editButton.addEventListener("click", function () {
    if (editButton.textContent === "Editar") {
      for (let i = 0; i < 5; i++) {
        // Ajuste para incluir la columna de fecha
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
  ventaForm.reset()
})

const loginBtn = document.getElementById("loginBtn")

if (loginBtn) {
  if (window.localStorage.getItem("user")) {
    loginBtn.innerHTML = `<a class="btn btn-primary" onclick='window.localStorage.removeItem("user"); window.location.reload();'>Cerrar sesion</a>`
  } else {
    loginBtn.innerHTML = `<a href="/login" class="btn btn-primary">Iniciar sesion</a>`
  }
}
