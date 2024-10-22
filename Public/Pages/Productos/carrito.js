let productosEnCarrito = localStorage.getItem("productos-en-carrito")
productosEnCarrito = JSON.parse(productosEnCarrito)

const contenedorCarritoVacio = document.querySelector("#carrito-vacio")
const contenedorCarritoProductos = document.querySelector("#carrito-productos")
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones")
const contenedorCarritoComprado = document.querySelector("#carrito-comprado")
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar")
const botonVaciar = document.querySelector("#carrito-acciones-vaciar")
const contenedorTotal = document.querySelector("#total")
const botonComprar = document.querySelector("#carrito-acciones-comprar")

// Formateador para moneda en pesos argentinos
const formatearMoneda = (valor) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(valor)
}

function cargarProductosCarrito() {
  if (productosEnCarrito && productosEnCarrito.length > 0) {
    contenedorCarritoVacio.classList.add("disabled")
    contenedorCarritoProductos.classList.remove("disabled")
    contenedorCarritoAcciones.classList.remove("disabled")
    contenedorCarritoComprado.classList.add("disabled")

    contenedorCarritoProductos.innerHTML = ""

    productosEnCarrito.forEach((producto) => {
      const div = document.createElement("div")
      div.classList.add("carrito-producto")
      div.innerHTML = `
                <img class="carrito-producto-imagen" src="${
                  producto.imagen
                }" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>${formatearMoneda(producto.precio)}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>${formatearMoneda(
                      producto.precio * producto.cantidad
                    )}</p>
                </div>
                <h2<button class="carrito-producto-eliminar" id="${
                  producto.id
                }"><i class="bi bi-trash-fill"></i></button></h2>
            `

      contenedorCarritoProductos.append(div)
    })

    actualizarBotonesEliminar()
    actualizarTotal()
  } else {
    contenedorCarritoVacio.classList.remove("disabled")
    contenedorCarritoProductos.classList.add("disabled")
    contenedorCarritoAcciones.classList.add("disabled")
    contenedorCarritoComprado.classList.add("disabled")
  }
}

cargarProductosCarrito()

function actualizarBotonesEliminar() {
  botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar")

  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", eliminarDelCarrito)
  })
}

function eliminarDelCarrito(e) {
  Toastify({
    text: "Producto eliminado",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, rgb(158, 6, 6), rgb(158, 6, 6))",
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
  const index = productosEnCarrito.findIndex(
    (producto) => producto.id === idBoton
  )

  productosEnCarrito.splice(index, 1)
  cargarProductosCarrito()

  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  )
}

botonVaciar.addEventListener("click", vaciarCarrito)
function vaciarCarrito() {
  Swal.fire({
    title: "¿Estás seguro?",
    icon: "question",
    html: `Se van a borrar ${productosEnCarrito.reduce(
      (acc, producto) => acc + producto.cantidad,
      0
    )} productos.`,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  }).then((result) => {
    if (result.isConfirmed) {
      productosEnCarrito.length = 0
      localStorage.setItem(
        "productos-en-carrito",
        JSON.stringify(productosEnCarrito)
      )
      cargarProductosCarrito()
    }
  })
}

function actualizarTotal() {
  const totalCalculado = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.precio * producto.cantidad,
    0
  )
  contenedorTotal.innerText = formatearMoneda(totalCalculado)
}

botonComprar.addEventListener("click", comprarCarrito)
async function comprarCarrito() {
  const productosParaComprar = productosEnCarrito.map((producto) => ({
    title: producto.titulo,
    price: producto.precio,
    quantity: producto.cantidad,
  }))

  const producto = productosParaComprar[0]

  try {
    const response = await fetch("/api/mercadopago/create_preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: producto.title,
        price: producto.price,
        quantity: producto.quantity,
      }),
    })

    // Verifica si la respuesta es válida y tiene el formato correcto
    if (!response.ok) {
      throw new Error("La respuesta no fue exitosa")
    }

    const data = await response.json()

    // Verifica si el id está presente en la respuesta
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl
    }
  } catch (error) {
    console.error("Error en la compra:", error)
    Swal.fire({
      title: "Error",
      text: "Hubo un problema al procesar tu compra. Intenta de nuevo.",
      icon: "error",
      confirmButtonText: "Aceptar",
    })
  }
}

const loginBtn = document.getElementById("loginBtn")

if (loginBtn) {
  if (window.localStorage.getItem("user")) {
    loginBtn.innerHTML = `<a class="btn btn-primary" onclick='window.localStorage.removeItem("user"); window.location.reload();'>Cerrar sesion</a>`
  } else {
    loginBtn.innerHTML = `<a href="/login" class="btn btn-primary">Iniciar sesion</a>`
  }
}

// botonComprar.addEventListener("click", comprarCarrito);
// function comprarCarrito() {

//     productosEnCarrito.length = 0;
//     localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

//     contenedorCarritoVacio.classList.add("disabled");
//     contenedorCarritoProductos.classList.add("disabled");
//     contenedorCarritoAcciones.classList.add("disabled");
//     contenedorCarritoComprado.classList.remove("disabled");

// }
