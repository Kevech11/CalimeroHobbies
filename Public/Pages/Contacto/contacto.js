const loginBtn = document.getElementById("loginBtn")
const contactForm = document.getElementById("contact-form")

if (loginBtn) {
  if (window.localStorage.getItem("user")) {
    loginBtn.innerHTML = `<a class="btn btn-primary" onclick='window.localStorage.removeItem("user"); window.location.reload();'>Cerrar sesion</a>`
  } else {
    loginBtn.innerHTML = `<a href="/login" class="btn btn-primary">Iniciar sesion</a>`
  }
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
      },
      body: JSON.stringify({ name, email, subject, message }),
    })

    if (!response.ok) {
      throw new Error("La respuesta no fue exitosa")
    }

    const data = await response.json()

    // Swal.fire({
    //   title: "Mensaje enviado",
    //   text: data.message,
    //   icon: "success",
    //   confirmButtonText: "Aceptar",
    // })

    contactForm.reset()
  } catch (error) {
    console.error("Error al enviar mensaje:", error)
    // Swal.fire({
    //   title: "Error",
    //   text: "Hubo un problema al enviar tu mensaje. Intenta de nuevo.",
    //   icon: "error",
    //   confirmButtonText: "Aceptar",
    // })
  }
})
