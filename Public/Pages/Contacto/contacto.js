const loginBtn = document.getElementById("loginBtn")
const contactForm = document.getElementById("contact-form")
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

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault()

  const formData = new FormData(contactForm)
  const name = formData.get("name")
  const email = formData.get("email")
  const subject = formData.get("subject")
  const message = formData.get("message")

  try {
    const response = await fetch("/api/contact/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name, email, subject, message }),
    })

    console.log(response)
    if (!response.ok) {
      throw new Error("La respuesta no fue exitosa")
    }

    const data = await response.json()

    Swal.fire({
      title: "Mensaje enviado",
      text: data.message,
      icon: "success",
      confirmButtonText: "Aceptar",
    })

    contactForm.reset()
  } catch (error) {
    console.error("Error al enviar mensaje:", error)
    Swal.fire({
      title: "Error",
      text: "Hubo un problema al enviar tu mensaje. Intenta de nuevo.",
      icon: "error",
      confirmButtonText: "Aceptar",
    })
  }
})

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