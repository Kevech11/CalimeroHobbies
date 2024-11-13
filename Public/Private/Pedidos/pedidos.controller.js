const loginBtn = document.getElementById("loginBtn")

const obtenerPedidos = async () => {
  try {
    const response = await fetch("/api/contact", {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    })

    if (response.status === 403) {
      window.location.href = "/home"
    }

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
  const fechaMensaje = document.getElementById("fechaMensaje")

  idPedido.innerHTML = pedido._id.slice(-5)
  nombrePedido.innerHTML = pedido.name
  emailPedido.innerHTML = pedido.email
  asuntoPedido.innerHTML = pedido.subject
  mensajePedido.innerHTML = pedido.message
  fechaMensaje.innerHTML = new Date(pedido.createdAt).toLocaleDateString()
}

async function agregarPedidoATabla() {
  const pedidos = await obtenerPedidos()
  const tabla = document.getElementById("pedidosBody")
  const fila = document.createElement("tr")

  pedidos.forEach((pedido) => {
    const fecha = new Date(pedido.createdAt);
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${pedido._id.slice(-5)}</td>
      <td>${pedido.name}</td>
      <td>${pedido.email}</td>
      <td>${pedido.subject}</td>
      <td>${fecha.toLocaleDateString()}</td>
      <td>
        <button class="btn btn-primary" id="open-modal-${pedido._id}">Ver</button>
      </td>
    `;
    tabla.appendChild(fila);
  
    const boton = document.getElementById(`open-modal-${pedido._id}`);
  
    
    boton.style.padding = "8px 16px";
    boton.style.fontSize = "14px";
    boton.style.border = "none";
    boton.style.borderRadius = "4px";
    boton.style.cursor = "pointer";
    boton.style.backgroundColor = "#007bff";
    boton.style.color = "white";
    
    
    boton.addEventListener("mouseover", () => {
      boton.style.backgroundColor = "#0056b3";
    });
    boton.addEventListener("mouseout", () => {
      boton.style.backgroundColor = "#007bff";
    });
  
    boton.addEventListener("click", () => {
      openModal(pedido);
    });
  });
}

agregarPedidoATabla()

if (loginBtn) {
  if (window.localStorage.getItem("user")) {
    loginBtn.innerHTML = `<a class="btn btn-primary" onclick='window.localStorage.removeItem("user"); window.location.reload();'>Cerrar sesion</a>`
  } else {
    loginBtn.innerHTML = `<a href="/login" class="btn btn-primary">Iniciar sesion</a>`
  }
}
