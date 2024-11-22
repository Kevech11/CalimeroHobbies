const loginBtn = document.getElementById("loginBtn")
const searchInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("searchBtn")

if (loginBtn) {
    if (window.localStorage.getItem("user")) {
      loginBtn.innerHTML = `<a class="btn btn-primary" onclick='window.localStorage.removeItem("user"); window.location.reload();'>Cerrar sesion</a>`
    } else {
      loginBtn.innerHTML = `<a href="/login" class="btn btn-primary">Iniciar sesion</a>`
    }
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