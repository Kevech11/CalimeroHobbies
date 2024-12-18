const loginBtn = document.getElementById("loginBtn")
const newUserForm = document.getElementById("new-user")
const usersTable = document.getElementById("users-table-body")
const botonesCategorias = document.querySelectorAll(".boton-categoria")
const contenedores = document.querySelectorAll(".contenedor")
const contenedorUsuarios = document.getElementById("contenedor-usuarios")
const contenedorProductos = document.getElementById("contenedor-productos")
const contenedorCategorias = document.getElementById("contenedor-categorias")
const formularioProductos = document.querySelector("#formulario-productos")
const btnReportes = document.getElementById("btn-reportes")
const formularioCategorias = document.getElementById("formulario-categorias")

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
        renderCategoriasEnProductos()
        break
      case "categorias":
        contenedorCategorias.style.display = "block"
        renderCategorias()
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
const formularioProductosMasVendidos = document.getElementById("formulario-productos-mas-vendidos")
const ctx = document.getElementById("miGrafico").getContext("2d")
const ctxProductos = document.getElementById("miGraficoProductos").getContext("2d")
let chart = null
let chartProductos = null

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

formularioProductosMasVendidos.addEventListener("submit", async (e) => {
  e.preventDefault()

  chartProductos?.destroy()

  const fechaInicio = document.getElementById("fecha-inicio-productos").value
  const fechaFin = document.getElementById("fecha-fin-productos").value

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

  // Crear un objeto para acumular las cantidades por título
  const productosAcumulados = {}

  if (ventasFiltradas.length === 0) {
    alert("No hay ventas en el rango de fechas seleccionado")
    return
  }
  // Recorrer todas las ventas y productos
  ventasFiltradas.forEach(venta => {
    venta.productos.forEach(producto => {
      const titulo = producto.producto.titulo
      if (productosAcumulados[titulo]) {
        productosAcumulados[titulo] += producto.cantidad
      } else {
        productosAcumulados[titulo] = producto.cantidad
      }
    })
  })

  // Convertir el objeto a array con el formato requerido
  const productosMasVendidos = Object.entries(productosAcumulados).map(([titulo, cantidad]) => ({
    titulo,
    cantidad
  }))

  

    // Chart productos tipo torta
  chartProductos = new Chart(ctxProductos, {
    type: "pie",
    data: {
      labels: productosMasVendidos.map((producto) => producto.titulo).slice(0, 5),
      datasets: [{ data: productosMasVendidos.map((producto) => producto.cantidad).slice(0, 5) }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 3, // Hace el gráfico más pequeño
      plugins: {
        legend: {
          display: true,
        }
      }
    }
  })
})

//Gestion de productos
const productosLista = document.getElementById("productos-lista")
const select = document.getElementById("categoria")

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



async function renderProductos() {
  const productosLista = document.getElementById("productos-lista");
  const productos = await obtenerProductos();

  productosLista.innerHTML = productos
    .map(
      (producto) => `
      <tr data-id="${producto._id}">
        <td contenteditable="false">${producto.titulo}</td>
        <td contenteditable="false">${producto.marca}</td>
        <td contenteditable="false">${producto.precio}</td>
        <td contenteditable="false">${producto.categoria.name}</td>
        <td contenteditable="false">${producto.stock || 10}</td>
        <td>
          <button class="btn-editar">Editar</button>
          <button class="btn-guardar" style="display:none;">Guardar</button>
          <button class="btn-eliminar">Eliminar</button>
        </td>
      </tr>`
    )
    .join("");

  document.querySelectorAll(".btn-editar").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      row.querySelectorAll("td[contenteditable]").forEach((cell) => {
        cell.contentEditable = true;
        cell.style.backgroundColor = "#f9f9f9";
      });
      row.querySelector(".btn-guardar").style.display = "inline-block";
      e.target.style.display = "none";
    })
  );

  document.querySelectorAll(".btn-guardar").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const row = e.target.closest("tr");
      const id = row.dataset.id;
      const data = {
        titulo: row.children[0].innerText,
        marca: row.children[1].innerText,
        precio: row.children[2].innerText,
        categoria: row.children[3].innerText,
        stock: row.children[4].innerText,
      };
      if (await actualizarProducto(id, data)) {
        alert("Producto actualizado exitosamente");
        renderProductos();
      } else {
        alert("Error al actualizar producto");
      }
    })
  );

  document.querySelectorAll(".btn-eliminar").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const id = e.target.closest("tr").dataset.id;
      eliminarProducto(id);
    })
  );
}

async function obtenerCategorias() {
  const response = await fetch("/api/categories", {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  })

  const categorias = await response.json()
  return categorias
}


async function renderCategoriasEnProductos() {
  const categorias = await obtenerCategorias()

  select.innerHTML += categorias.map((categoria) => `<option value="${categoria._id}">${categoria.name.charAt(0).toUpperCase() + categoria.name.slice(1)}</option>`).join("")
}

async function actualizarProducto(id, data) {
  try {
    const response = await fetch(`/api/productos/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return false;
  }
}

renderProductos();

// Categorias
async function crearCategoria(name) {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  })

  if (response.status === 201) {
    alert("Categoria creada exitosamente")
  } else {
    alert("Error al crear categoria")
  }
}

async function eliminarCategoria(id) {
  const response = await fetch(`/api/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  })
} 

async function renderCategorias() {
  const categorias = await obtenerCategorias()
  const categoriasTableBody = document.getElementById("categorias-table-body")
  categoriasTableBody.innerHTML = categorias.map((categoria) => `<tr><td>${categoria.name}</td><td><button class="btn-eliminar" id="categoria-${categoria._id}">Eliminar</button></td></tr>`).join("")
  const botonesCategorias = document.querySelectorAll("[id*='categoria-']")
  botonesCategorias.forEach((boton) => {
    boton.addEventListener("click", async () => {
      const id = boton.id.split("-")[1]
      await eliminarCategoria(id)
      renderCategorias()
    })
  })
}

formularioCategorias.addEventListener("submit", async (e) => {
  e.preventDefault()
  const name = document.getElementById("nombre-categoria").value
  await crearCategoria(name)
  renderCategorias()
  document.getElementById("nombre-categoria").value = ""
})

