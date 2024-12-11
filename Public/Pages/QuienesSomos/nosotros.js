const loginBtn = document.getElementById("loginBtn")
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



// let productosEnCarrito
// let productosEnCarritoLS = localStorage.getItem("productos-en-carrito")
// if (productosEnCarritoLS) {
//   productosEnCarrito = JSON.parse(productosEnCarritoLS)
//   actualizarNumerito()
// } else {
//   productosEnCarrito = []
// }

// function agregarAlCarrito(e) {
//   Toastify({
//     text: "Producto agregado",
//     duration: 3000,
//     close: true,
//     gravity: "top",
//     position: "right",
//     stopOnFocus: true,
//     style: {
//       background: "linear-gradient(to right, rgb(4, 83, 4), rgb(4, 83, 4)",
//       borderRadius: "2rem",
//       textTransform: "uppercase",
//       fontSize: ".75rem",
//     },
//     offset: {
//       x: "1.5rem",
//       y: "1.5rem",
//     },
//     onClick: function () {},
//   }).showToast()

//   const idBoton = e.currentTarget.id
//   const productoAgregado = productos.find((producto) => producto.id === idBoton)

//   if (productosEnCarrito.some((producto) => producto.id === idBoton)) {
//     const index = productosEnCarrito.findIndex(
//       (producto) => producto.id === idBoton
//     )
//     productosEnCarrito[index].cantidad++
//   } else {
//     productoAgregado.cantidad = 1
//     productosEnCarrito.push(productoAgregado)
//   }

//   actualizarNumerito()

//   localStorage.setItem(
//     "productos-en-carrito",
//     JSON.stringify(productosEnCarrito)
//   )
// }

//   function actualizarNumerito() {
//     let nuevoNumerito = productosEnCarrito.reduce(
//       (acc, producto) => acc + producto.cantidad,
//       0
//     )
//     numerito.innerText = nuevoNumerito
//   }