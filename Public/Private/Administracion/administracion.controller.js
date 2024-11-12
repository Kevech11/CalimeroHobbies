const loginBtn = document.getElementById("loginBtn")

if (loginBtn) {
  if (window.localStorage.getItem("user")) {
    loginBtn.innerHTML = `<a class="btn btn-primary" onclick='window.localStorage.removeItem("user"); window.location.reload();'>Cerrar sesion</a>`
  } else {
    loginBtn.innerHTML = `<a href="/login" class="btn btn-primary">Iniciar sesion</a>`
  }
}

const newUserForm = document.getElementById("new-user")
const usersTable = document.getElementById("users-table-body")

newUserForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  const name = document.getElementById("name").value
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const role = document.getElementById("role").value

  const response = await fetch("/api/admin/new-user", {
    method: "POST",
    headers: {
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
  const response = await fetch("/api/admin/users")

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
