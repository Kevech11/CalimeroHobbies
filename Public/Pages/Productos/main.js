let productos = []
const searchInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("searchBtn")
const contenedorProductos = document.querySelector("#contenedor-productos")
let botonesAgregar = document.querySelectorAll(".producto-agregar")
const numerito = document.querySelector("#numerito")
const botonesCategorias = document.querySelectorAll(".boton-categoria")

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

if (new URLSearchParams(window.location.search).has("search")) {
  const term = new URLSearchParams(window.location.search).get("search")
  fetch("/api/productos/search?term=" + term)
    .then((response) => response.json())
    .then((data) => {
      productos = data.map((producto) => {
        return {
          id: producto._id,
          titulo: producto.titulo,
          marca: producto.marca,
          precio: producto.precio,
          imagen: producto.imagen,
          categoria: producto.categoria,
        }
      })
      cargarProductos(productos)
    })
} else {
  fetch("/api/productos")
    .then((response) => response.json())
    .then((data) => {
      productos = data.map((producto) => {
        return {
          id: producto._id,
          titulo: producto.titulo,
          marca: producto.marca,
          precio: producto.precio,
          imagen: producto.imagen,
          categoria: producto.categoria,
        }
      })
      cargarProductos(productos)
    })
}

botonesCategorias.forEach((boton) =>
  boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible")
  })
)

function cargarProductos(productosElegidos) {
  contenedorProductos.innerHTML = ""

  productosElegidos.forEach((producto) => {
    const div = document.createElement("div")
    div.classList.add("producto")
    console.log(producto)
    div.innerHTML = `
            <img class="producto-imagen" src="Pages/Productos/img/${producto.categoria.name}/${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h1 class="producto-titulo">${producto.titulo}</h1>
                <h4 class="producto-marca">${producto.marca}</h4>
                <p class="producto-precio">${producto.precio.toLocaleString(
                  "es-AR",
                  {
                    style: "currency",
                    currency: "ARS",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }
                )}</p>
                <button class="producto-agregar" id="${
                  producto.id
                }">Agregar</button>
            </div>
        `

    contenedorProductos.append(div)
  })
  actualizarBotonesAgregar()
}


botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    botonesCategorias.forEach((boton) => boton.classList.remove("active"))
    e.currentTarget.classList.add("active")

    if (e.currentTarget.id != "todos") {
      const productosBoton = productos.filter((producto) => {
        return producto.categoria.id == e.currentTarget.id
      })
      cargarProductos(productosBoton)
    } else {
      cargarProductos(productos)
    }
  })
})


function actualizarBotonesAgregar() {
  botonesAgregar = document.querySelectorAll(".producto-agregar")

  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", agregarAlCarrito)
  })
}

let productosEnCarrito
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito")
if (productosEnCarritoLS) {
  productosEnCarrito = JSON.parse(productosEnCarritoLS)
  actualizarNumerito()
} else {
  productosEnCarrito = []
}

function agregarAlCarrito(e) {
  Toastify({
    text: "Producto agregado",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, rgb(4, 83, 4), rgb(4, 83, 4)",
      borderRadius: "2rem",
      textTransform: "uppercase",
      fontSize: ".75rem",
    },
    offset: {
      x: "1.5rem",
      y: "1.5rem",
    },
    onClick: function () {},
  }).showToast()

  const idBoton = e.currentTarget.id
  const productoAgregado = productos.find((producto) => producto.id === idBoton)

  if (productosEnCarrito.some((producto) => producto.id === idBoton)) {
    const index = productosEnCarrito.findIndex(
      (producto) => producto.id === idBoton
    )
    productosEnCarrito[index].cantidad++
  } else {
    productoAgregado.cantidad = 1
    productosEnCarrito.push(productoAgregado)
  }

  actualizarNumerito()

  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  )
}

function actualizarNumerito() {
  let nuevoNumerito = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  )
  numerito.innerText = nuevoNumerito
}

function renderizarCategorias() {
  fetch("/api/categories")
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      const menu = document.querySelector(".menu")
      menu.innerHTML = data.map((categoria) => `<li><button id="${categoria._id}" class="boton-menu boton-categoria"><h2><i class="bi bi-chevron-right"></i></h2></i><h2>${categoria.name.charAt(0).toUpperCase() + categoria.name.slice(1)}</h2></button></li>`).join("")
      menu.innerHTML += `<li>
                        <a class="boton-menu boton-carrito" href="/Carrito">
                            <h1><i class="bi bi-cart"> </i>Carrito</h1>
                        </a>
                    </li>`
    })
}


renderizarCategorias()
