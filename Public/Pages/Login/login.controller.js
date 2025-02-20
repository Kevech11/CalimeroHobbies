const container = document.querySelector(".container")
const btnSignIn = document.getElementById("btn-sign-in")
const btnSignUp = document.getElementById("btn-sign-up")
const registerForm = document.querySelector("#sign-up")
const loginForm = document.querySelector("#sign-in")

btnSignIn.addEventListener("click", () => {
  container.classList.remove("toggle")
})

btnSignUp.addEventListener("click", () => {
  container.classList.add("toggle")
})

registerForm.addEventListener("submit", async (e) => {
  try {
    e.preventDefault()

    const data = {
      name: registerForm.querySelector("input[name='name']").value,
      email: registerForm.querySelector("input[name='email']").value,
      password: registerForm.querySelector("input[name='password']").value,
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Error al registrar el usuario")
    }
    const result = await response.json()
    alert(
      "Usuario registrado correctamente. Por favor verifica el email registrado en tu correo para validar la cuenta."
    )
    registerForm.querySelector("input[name='name']").value = ""
    registerForm.querySelector("input[name='email']").value = ""
    registerForm.querySelector("input[name='password']").value = ""
  } catch (error) {
    console.error(error)
    alert("Ocurrió un error al registrar el usuario")
  }
})

loginForm.addEventListener("submit", async (e) => {
  try {
    e.preventDefault()

    const data = {
      email: loginForm.querySelector("input[name='email']").value,
      password: loginForm.querySelector("input[name='password']").value,
    }

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Error al iniciar sesión")
    }
    const result = await response.json()

    alert("Usuario autenticado correctamente")
    window.localStorage.setItem("token", result.token)
    window.localStorage.setItem("user", JSON.stringify(result.user))

    if (result.user.role === "gestion_ventas") {
      window.location.href = "/ventas"
    } else if (result.user.role === "gestion_productos") {
      window.location.href = "/gestiondeproductos"
    } else if (result.user.role === "admin") {
      window.location.href = "/administracion"
    } else {
      window.location.href = "/home"
    }
  } catch (error) {
    console.error(error)
    alert("Usuario y/o contraseña incorrectas")
  }
})
