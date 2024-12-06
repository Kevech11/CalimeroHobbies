const loginBtn = document.getElementById("loginBtn")
const searchInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("searchBtn")

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
  window.localStorage.removeItem("user");
  window.localStorage.removeItem("productos-en-carrito");
  window.location.href = "/home";
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