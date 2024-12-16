const loginBtn = document.getElementById("loginBtn")
const searchInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("searchBtn")

// if (loginBtn) {
//   if (window.localStorage.getItem("user")) {
//     loginBtn.innerHTML = `<a class="btn btn-primary" onclick='window.localStorage.removeItem("user"); window.location.reload();'>Cerrar sesion</a>`
//   } else {
//     loginBtn.innerHTML = `<a href="/login" class="btn btn-primary">Iniciar sesion</a>`
//   }
// }

const numerito = document.querySelector("#numerito")

numerito.innerText = window.localStorage.getItem("productos-en-carrito") ? JSON.parse(window.localStorage.getItem("productos-en-carrito")).length : 0



if (loginBtn) {
  if (window.localStorage.getItem("user")) {
    loginBtn.innerHTML = `
      <a href="/MiCuenta" class="btn btn-secondary">Mi Cuenta</a>
    `
    const cerrarSesionLi = document.createElement("li")
    cerrarSesionLi.innerHTML = `<button class="btn btn-primary">Cerrar sesión</button>`
    loginBtn.parentNode.appendChild(cerrarSesionLi)

    cerrarSesionLi.addEventListener("click", cerrarSesion)
  } else {
    loginBtn.innerHTML = `<a href="/login">Iniciar sesión</a>`
  }
}

function cerrarSesion() {
  window.localStorage.removeItem("user")
  window.location.reload() // Recargar para actualizar el estado del navbar
}

function redireccionarAlBuscar() {
  const term = searchInput.value
  window.location.href = `/Productos?search=${term}`
}

searchBtn.addEventListener("click", redireccionarAlBuscar)
searchInput.addEventListener("keypress", (e) => {
  console.log(e.key)
  if (e.key === "Enter") {
    redireccionarAlBuscar()
  }
})
