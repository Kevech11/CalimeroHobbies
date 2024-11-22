const loginBtn = document.getElementById("loginBtn")
const newUserForm = document.getElementById("new-user")
const usersTable = document.getElementById("users-table-body")
const botonesCategorias = document.querySelectorAll(".boton-categoria")
const contenedores = document.querySelectorAll(".contenedor")
const contenedorUsuarios = document.getElementById("contenedor-usuarios")
const contenedorProductos = document.getElementById("contenedor-productos")
const formularioProductos = document.querySelector("#formulario-productos")

if (loginBtn) {
  if (window.localStorage.getItem("user")) {
    loginBtn.innerHTML = `<a class="btn btn-primary" onclick='window.localStorage.removeItem("user");window.localStorage.removeItem("token"); window.location.reload();'>Cerrar sesion</a>`
  } else {
    loginBtn.innerHTML = `<a href="/login" class="btn btn-primary">Iniciar sesion</a>`
  }
}

newUserForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  const name = document.getElementById("name").value
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const role = document.getElementById("role").value

  const response = await fetch("/api/admin/new-user", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, role }),
  })

  if (response.status === 201) {
    alert("Usuario creado exitosamente")
    window.location.reload()
  } else {
    alert("Error al crear usuario")
  }
})

async function getUsers() {
  const response = await fetch("/api/admin/users", {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  })

  if (response.status === 403) {
    window.location.href = "/home"
  }

  const users = await response.json()

  return users
}

async function renderUsers() {
  const users = await getUsers()
  console.log(users)

  usersTable.innerHTML = users
    .map(
      (user) => `
      <tr>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td><button class="btn btn-eliminar" id="${user._id}">Eliminar</button></td>
      </tr>
    `
    )
    .join("")

  const deleteButtons = document.querySelectorAll(".btn-eliminar")

  deleteButtons.forEach((button) =>
    button.addEventListener("click", async () => {
      const response = await fetch(`/api/admin/delete-user/${button.id}`, {
        method: "DELETE",
      })

      if (response.status === 200) {
        alert("Usuario eliminado exitosamente")
        window.location.reload()
      } else {
        alert("Error al eliminar usuario")
      }
    })
  )
}

renderUsers()

// Crear productos
formularioProductos.addEventListener("submit", async (e) => {
  e.preventDefault()

  const formData = new FormData(formularioProductos)
  const response = await cargarProducto(formData)

  if (response.status === 201) {
    alert("Producto creado exitosamente")
    window.location.reload()
  } else {
    alert("Error al crear producto")
  }
})

async function cargarProducto(formData) {
  return await fetch("/api/productos", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
    body: formData,
  })
}

botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    botonesCategorias.forEach((boton) => boton.classList.remove("active"))
    contenedores.forEach((contenedor) => (contenedor.style.display = "none"))

    e.currentTarget.classList.add("active")

    switch (e.currentTarget.id) {
      case "usuarios":
        contenedorUsuarios.style.display = "flex"
        const tabla = document.querySelector(".users-table")
        tabla.style.display = "block"
        tabla.style.width = "100%"
        renderUsers()
        break
      case "productos":
        contenedorProductos.style.display = "block"
        break
    }
  })
})
