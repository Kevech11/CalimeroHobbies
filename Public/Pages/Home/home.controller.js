// let loggedUser = localStorage.getItem("logged.in.user");
// let buttonIniciarSesion = document.querySelector("#button-iniciar-sesion");
// let buttonCerrarSesion = document.querySelector("#button-cerrar-sesion");

// buttonCerrarSesion.onclick = function() {
//     localStorage.removeItem("logged.in.user");
//     localStorage.removeItem("carrito");
// }

// if (loggedUser) {
//     // Hacer acá todo lo que  quiera hacer si el usuario esta logueado
//     buttonIniciarSesion.style.display = 'none';
//     buttonCerrarSesion.style.display = 'block';
// } else {
//     // Y hacer aca todo lo que  quiera hacer si el usuario no está logueado
//     buttonIniciarSesion.style.display = 'block';
//     buttonCerrarSesion.style.display = 'none';
// }

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
