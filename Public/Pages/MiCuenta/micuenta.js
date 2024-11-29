const loginBtn = document.getElementById("loginBtn")
const searchInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("searchBtn")
const apiURL = "https://restcountries.com/v3.1/all"

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

async function cargarPaises() {
  try {
    const response = await fetch(apiURL)
    const countries = await response.json()

    const selectPais = document.getElementById("country")

    countries.forEach((country) => {
      const option = document.createElement("option")
      option.value = country.name.common
      option.textContent = country.name.common
      selectPais.appendChild(option)
    })
  } catch (error) {
    console.error("Error al cargar los países:", error)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarPaises()
})

async function cargarDatos() {
  try {
    const response = await fetch(`http://localhost:5001/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    })

    const user = await response.json()
    const name = document.getElementById("name")
    const lastName = document.getElementById("lastName")
    const country = document.getElementById("country")
    const province = document.getElementById("province")
    const city = document.getElementById("city")
    const address = document.getElementById("address")
    const phone = document.getElementById("phone")

    name.value = user?.name || ""
    lastName.value = user?.lastName || ""
    country.value = user?.country || ""
    province.value = user?.province || ""
    city.value = user?.city || ""
    address.value = user?.address || ""
    phone.value = user?.phone || ""
  } catch (error) {
    console.error("Error al cargar los datos del usuario:", error)
  }
}

cargarDatos()
