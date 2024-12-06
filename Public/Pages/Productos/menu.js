const openMenu = document.querySelector("#open-menu")
const closeMenu = document.querySelector("#close-menu")
const aside = document.querySelector("aside")
const loginBtn = document.getElementById("loginBtn")

if (openMenu) {
  openMenu.addEventListener("click", () => {
    aside.classList.add("aside-visible")
  })
}

if (closeMenu) {
  closeMenu.addEventListener("click", () => {
    aside.classList.remove("aside-visible")
  })
}

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
