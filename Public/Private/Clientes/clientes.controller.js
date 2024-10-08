// Obtener el formulario y la tabla
const clienteForm = document.getElementById("clienteForm")
const clientesTable = document
  .getElementById("clientesTable")
  .getElementsByTagName("tbody")[0]

async function createClient(client) {
  const response = await fetch("/api/clientes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
    body: JSON.stringify(client),
  })
  return await response.json()
}

async function getClients() {
  const response = await fetch("/api/clientes", {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  })
  return await response.json()
}

document.addEventListener("DOMContentLoaded", async function () {
  const clients = await getClients()
  clients.forEach((client) => {
    const newRow = clientesTable.insertRow()
    newRow.insertCell(0).textContent = client._id.slice(19)
    newRow.insertCell(1).textContent = client.nombre
    newRow.insertCell(2).textContent = client.apellido
    newRow.insertCell(3).textContent = client.pais
    newRow.insertCell(4).textContent = client.provincia
    newRow.insertCell(5).textContent = client.localidad
    newRow.insertCell(6).textContent = client.direccion
    newRow.insertCell(7).textContent = client.telefono

    const actionsCell = newRow.insertCell(8)
    const deleteButton = document.createElement("button")
    deleteButton.textContent = "Eliminar"
    deleteButton.className = "btn-delete"

    const editButton = document.createElement("button")
    editButton.textContent = "Editar"
    editButton.className = "btn-edit"

    actionsCell.appendChild(editButton)
    actionsCell.appendChild(deleteButton)

    deleteButton.addEventListener("click", function () {
      if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
        clientesTable.deleteRow(newRow.rowIndex - 1)
      }
    })

    editButton.addEventListener("click", function () {
      if (editButton.textContent === "Editar") {
        for (let i = 0; i < 8; i++) {
          const cell = newRow.cells[i]
          const input = document.createElement("input")
          input.type = "text"
          input.value = cell.textContent
          cell.textContent = ""
          cell.appendChild(input)
        }
        editButton.textContent = "Guardar"
      } else {
        for (let i = 0; i < 8; i++) {
          const cell = newRow.cells[i]
          const input = cell.querySelector("input")
          cell.textContent = input.value
        }
        editButton.textContent = "Editar"
      }
    })
  })
})

// Escuchar el evento de envío del formulario
clienteForm.addEventListener("submit", async function (event) {
  event.preventDefault() // Prevenir el envío del formulario

  // Obtener los valores de los campos
  const id = document.getElementById("id").value
  const nombre = document.getElementById("nombre").value
  const apellido = document.getElementById("apellido").value
  const pais = document.getElementById("pais").value
  const provincia = document.getElementById("provincia").value
  const localidad = document.getElementById("localidad").value
  const direccion = document.getElementById("direccion").value
  const telefono = document.getElementById("telefono").value

  // Crear una nueva fila y agregar los valores
  const newRow = clientesTable.insertRow()
  newRow.insertCell(0).textContent = id
  newRow.insertCell(1).textContent = nombre
  newRow.insertCell(2).textContent = apellido
  newRow.insertCell(3).textContent = pais
  newRow.insertCell(4).textContent = provincia
  newRow.insertCell(5).textContent = localidad
  newRow.insertCell(6).textContent = direccion
  newRow.insertCell(7).textContent = telefono

  // Crear celda de acciones y botones de eliminar y editar
  const actionsCell = newRow.insertCell(8)
  const deleteButton = document.createElement("button")
  deleteButton.textContent = "Eliminar"
  deleteButton.className = "btn-delete"

  const editButton = document.createElement("button")
  editButton.textContent = "Editar"
  editButton.className = "btn-edit"

  actionsCell.appendChild(editButton)
  actionsCell.appendChild(deleteButton)

  // Añadir evento de eliminación al botón
  deleteButton.addEventListener("click", function () {
    if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      clientesTable.deleteRow(newRow.rowIndex - 1)
    }
  })

  // Añadir evento de edición al botón
  editButton.addEventListener("click", function () {
    if (editButton.textContent === "Editar") {
      // Habilitar la edición
      for (let i = 0; i < 8; i++) {
        const cell = newRow.cells[i]
        const input = document.createElement("input")
        input.type = "text"
        input.value = cell.textContent
        cell.textContent = ""
        cell.appendChild(input)
      }
      editButton.textContent = "Guardar"
    } else {
      // Guardar los cambios
      for (let i = 0; i < 8; i++) {
        const cell = newRow.cells[i]
        const input = cell.querySelector("input")
        cell.textContent = input.value
      }
      editButton.textContent = "Editar"
    }
  })

  try {
    const newClient = await createClient({
      nombre,
      apellido,
      pais,
      provincia,
      localidad,
      direccion,
      telefono,
    })
    console.log(newClient)
  } catch (error) {
    console.log(error)
  }

  clienteForm.reset()
})

const loginBtn = document.getElementById("loginBtn")

if (loginBtn) {
  if (window.localStorage.getItem("user")) {
    loginBtn.innerHTML = `<a class="btn btn-primary" onclick='window.localStorage.removeItem("user"); window.location.reload();'>Cerrar sesion</a>`
  } else {
    loginBtn.innerHTML = `<a href="/login" class="btn btn-primary">Iniciar sesion</a>`
  }
}
