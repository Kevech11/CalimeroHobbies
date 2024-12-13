const loginBtn = document.getElementById("loginBtn")
const newUserForm = document.getElementById("new-user")
const usersTable = document.getElementById("users-table-body")
const botonesCategorias = document.querySelectorAll(".boton-categoria")
const contenedores = document.querySelectorAll(".contenedor")
const contenedorUsuarios = document.getElementById("contenedor-usuarios")
const contenedorProductos = document.getElementById("contenedor-productos")
const formularioProductos = document.querySelector("#formulario-productos")
const btnReportes = document.getElementById("btn-reportes")

if (loginBtn) {
  if (window.localStorage.getItem("user")) {
    loginBtn.innerHTML = `<a class="btn btn-primary" onclick='window.localStorage.removeItem("user");window.localStorage.removeItem("token"); window.location.reload();'>Cerrar sesion</a>`
  } else {
    loginBtn.innerHTML = `<a href="/login" class="btn btn-primary">Iniciar sesion</a>`
  }
}

newUserForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  const name = document.getElementById("name").value
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const role = document.getElementById("role").value

  const response = await fetch("/api/admin/new-user", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, role }),
  })

  if (response.status === 201) {
    alert("Usuario creado exitosamente")
    window.location.reload()
  } else {
    alert("Error al crear usuario")
  }
})

async function getUsers() {
  const response = await fetch("/api/admin/users", {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  })

  if (response.status === 403) {
    window.location.href = "/home"
  }
  const users = await response.json()
  return users
}

async function renderUsers() {
  const users = await getUsers()
  console.log(users)

  usersTable.innerHTML = users
    .map(
      (user) => `
      <tr>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td><button class="btn btn-eliminar" id="${user._id}">Eliminar</button></td>
      </tr>
    `
    )
    .join("")

  const deleteButtons = document.querySelectorAll(".btn-eliminar")

  deleteButtons.forEach((button) =>
    button.addEventListener("click", async () => {
      const response = await fetch(`/api/admin/delete-user/${button.id}`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
        method: "DELETE",
      })

      if (response.status === 200) {
        alert("Usuario eliminado exitosamente")
        window.location.reload()
      } else {
        alert("Error al eliminar usuario")
      }
    })
  )
}

renderUsers()

// Crear productos
formularioProductos.addEventListener("submit", async (e) => {
  e.preventDefault()

  const formData = new FormData(formularioProductos)
  const response = await cargarProducto(formData)

  if (response.status === 201) {
    alert("Producto creado exitosamente")
    window.location.reload()
  } else {
    alert("Error al crear producto")
  }
})

async function cargarProducto(formData) {
  return await fetch("/api/productos", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
    body: formData,
  })
}

botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    botonesCategorias.forEach((boton) => boton.classList.remove("active"))
    contenedores.forEach((contenedor) => (contenedor.style.display = "none"))

    e.currentTarget.classList.add("active")

    switch (e.currentTarget.id) {
      case "usuarios":
        contenedorUsuarios.style.display = "flex"
        const tabla = document.querySelector(".users-table")
        tabla.style.display = "block"
        tabla.style.width = "100%"
        renderUsers()
        break
      case "productos":
        contenedorProductos.style.display = "block"
        obtenerProductos().then((productos) => renderProductos(productos))
        break
      case "ventas":
        window.location.href = "/ventas"
        break
    }
  })
})

//nuevo
btnReportes.addEventListener("click", () => {
  mostrarSeccion("contenedor-reportes")
})

function mostrarSeccion(seccionId) {
  const secciones = document.querySelectorAll(".contenedor")
  secciones.forEach((seccion) => {
    if (seccion.id === seccionId) {
      seccion.style.display = "block"
    } else {
      seccion.style.display = "none"
    }
  })
}

// REPORTES
const formularioReportes = document.getElementById("formulario-reportes")
const ctx = document.getElementById("miGrafico").getContext("2d")
let chart = null

formularioReportes.addEventListener("submit", async (e) => {
  e.preventDefault()

  // chart.js:19 Uncaught (in promise) Error: Canvas is already in use. Chart with ID '0' must be destroyed before the canvas with ID 'miGrafico' can be reused.

  chart?.destroy()

  const tipoReporte = document.getElementById("tipo-reporte").value
  const fechaInicio = document.getElementById("fecha-inicio").value
  const fechaFin = document.getElementById("fecha-fin").value

  const response = await fetch("/api/ventas", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  })

  if (response.status === 403) {
    window.location.href = "/home"
  }

  const ventas = await response.json()

  // Filtrar por fecha
  const ventasFiltradas = ventas.filter((venta) => {
    const fechaVenta = new Date(venta.fecha)
    const inicio = fechaInicio ? new Date(fechaInicio) : new Date(0)
    const fin = fechaFin ? new Date(fechaFin) : new Date()
    return fechaVenta >= inicio && fechaVenta <= fin
  })

  const ventasMayoristas = ventasFiltradas.filter((venta) => venta.esMayorista)
  const ventasDiarias = ventasFiltradas.filter((venta) => !venta.esMayorista)

  let ventasPorMes = []

  if (tipoReporte === "ventas-mayoristas") {
    ventasPorMes = ventasMayoristas.map((venta) =>
      new Date(venta.fecha).getMonth()
    )
  } else if (tipoReporte === "ventas-diarias") {
    ventasPorMes = ventasDiarias.map((venta) =>
      new Date(venta.fecha).getMonth()
    )
  }

  const mesesChart = Array.from({ length: 12 }, (_, i) => 0)

  mesesChart.forEach((mes, index) => {
    ventasPorMes.forEach((venta) => {
      if (venta === index) {
        mesesChart[index]++
      }
    })
  })

  chart = new Chart(ctx, {
    type: "bar", // Tipo de gráfico: barra (bar) lineas (line)
    data: {
      labels: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ], // Etiquetas en el eje X
      datasets: [
        {
          label: "Ventas por mes", // Nombre del dataset
          data: mesesChart, // Datos para cada etiqueta
          backgroundColor: "rgb(31, 31, 78)", // Color de las barras
          borderColor: "rgba(75, 192, 192, 1)", // Color del borde de las barras
          borderWidth: 3, // Grosor del borde
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true, // Comenzar el eje Y desde cero
        },
      },
    },
  })
})


//Gestion de productos
const productosLista = document.getElementById("productos-lista")

async function obtenerProductos() {
  try {
    const response = await fetch("/api/productos", {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    })

    if (response.status === 403) {
      window.location.href = "/home"
    }

    const productos = await response.json()
    return productos
  } catch (error) {
    console.error("Error al obtener productos:", error)
    alert("Error al obtener productos")
  }
}

async function eliminarProducto(id) {
  try {
    const response = await fetch(`/api/productos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    })

    if (response.status === 204) {
      alert("Producto eliminado exitosamente")
      obtenerProductos().then((productos) => renderProductos(productos))
    } else {
      alert("Error al eliminar producto")
    }
  } catch (error) {
    console.error("Error al eliminar producto:", error)
    alert("Error al eliminar producto")
  }
}

function renderProductos(productos) {
  const productosLista = document.getElementById("productos-lista");
  const productosOrdenados = productos.sort((a, b) =>
    a.titulo.localeCompare(b.titulo, "es", { sensitivity: "base" })
  );
  const formatearPesos = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2, 
  });

  productosLista.innerHTML = productos
    .map(
      (producto) => `
      <tr>
        <td style="padding: 10px; border: 2px solid #555; text-align: center;">${producto.titulo}</td>
        <td style="padding: 10px; border: 2px solid #555; text-align: center;">${producto.marca}</td>
        <td style="padding: 10px; border: 2px solid #555; text-align: right;">$${producto.precio}</td>
        <td style="padding: 10px; border: 2px solid #555; text-align: center;">${producto.categoria}</td>
        <td style="padding: 10px; border: 2px solid #555; text-align: center;">${producto.stock || 10}</td>
        <td style="padding: 10px; border: 2px solid #555; text-align: center;">
          <button class="btn btn-eliminar" id="${producto._id}">Eliminar</button>
        </td>
      </tr>
    `
    )
    .join("");

  const deleteButtons = document.querySelectorAll(".btn-eliminar");

  deleteButtons.forEach((button) =>
    button.addEventListener("click", async () => {
      await eliminarProducto(button.id);
    })
  );
}
