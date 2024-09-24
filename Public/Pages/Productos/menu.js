const openMenu = document.querySelector("#open-menu")
const closeMenu = document.querySelector("#close-menu")
const aside = document.querySelector("aside")

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

const loginBtn = document.getElementById("loginBtn")

if (loginBtn) {
  if (window.localStorage.getItem("user")) {
    loginBtn.innerHTML = `<a class="btn btn-primary" onclick='window.localStorage.removeItem("user"); window.location.reload();'>Cerrar sesion</a>`
  } else {
    loginBtn.innerHTML = `<a href="/login" class="btn btn-primary">Iniciar sesion</a>`
  }
}
