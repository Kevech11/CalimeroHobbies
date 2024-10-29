const obtenerPedidos = async () => {
  try {
    const response = await fetch("/api/contact")
    if (!response.ok) {
      throw new Error("No se pudieron obtener los pedidos")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error al obtener pedidos:", error)
  }
}
// Función para agregar pedidos a la tabla

function openModal(pedido) {
  const modal = document.getElementById("modal")
  modal.style.display = "flex"

  const closeModal = document.getElementById("close")
  closeModal.addEventListener("click", () => {
    modal.style.display = "none"
  })

  const idPedido = document.getElementById("pedidoId")
  const nombrePedido = document.getElementById("pedidoNombre")
  const emailPedido = document.getElementById("pedidoEmail")
  const asuntoPedido = document.getElementById("pedidoAsunto")
  const mensajePedido = document.getElementById("pedidoMensaje")

  idPedido.innerHTML = pedido._id.slice(-5)
  nombrePedido.innerHTML = pedido.name
  emailPedido.innerHTML = pedido.email
  asuntoPedido.innerHTML = pedido.subject
  mensajePedido.innerHTML = pedido.message
}

async function agregarPedidoATabla() {
  const pedidos = await obtenerPedidos()
  const tabla = document.getElementById("pedidosBody")
  const fila = document.createElement("tr")

  pedidos.forEach((pedido) => {
    const fecha = new Date(pedido.createdAt)
    fila.innerHTML = `
        <td>${pedido._id.slice(-5)}</td>
        <td>${pedido.name}</td>
        <td>${pedido.email}</td>
        <td>${pedido.subject}</td>
        <td><button class="btn btn-primary" id="open-modal">Ver pedido</button></td>
    `

    tabla.appendChild(fila)
    document.getElementById("open-modal").addEventListener("click", () => {
      openModal(pedido)
    })
  })
}

agregarPedidoATabla()
// Simulando la llegada de pedidos uno por uno cada 2 segundos
// let contador = 0;
// const intervalo = setInterval(() => {
//     if (contador < pedidos.length) {
//         agregarPedidoATabla(pedidos[contador]);
//         contador++;
//     } else {
//         clearInterval(intervalo); // Detiene el intervalo cuando ya no hay más pedidos
//     }
// }, 2000);

const loginBtn = document.getElementById("loginBtn")

if (loginBtn) {
  if (window.localStorage.getItem("user")) {
    loginBtn.innerHTML = `<a class="btn btn-primary" onclick='window.localStorage.removeItem("user"); window.location.reload();'>Cerrar sesion</a>`
  } else {
    loginBtn.innerHTML = `<a href="/login" class="btn btn-primary">Iniciar sesion</a>`
  }
}
