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
async function agregarPedidoATabla() {
  const pedidos = await obtenerPedidos();
  const tabla = document.getElementById("pedidosBody");

  pedidos.forEach((pedido) => {
    const fecha = new Date(pedido.createdAt);
    const fila = document.createElement("tr");

    // Convertir los detalles del pedido en una lista ordenada
    const detallesPedido = pedido.message.split('\n'); // Asegúrate de que los detalles estén separados por saltos de línea
    const listaDetalles = detallesPedido.map(detalle => `<li>${detalle}</li>`).join('');

    fila.innerHTML = `
      <td>${pedido._id.slice(-5)}</td>
      <td>${pedido.name}</td>
      <td>${pedido.email}</td>
      <td>${pedido.subject}</td>
      <td>${fecha.toLocaleDateString()}</td>
      <td>
        <ul>${listaDetalles}</ul>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

agregarPedidoATabla()

if (loginBtn) {
  if (window.localStorage.getItem("user")) {
    loginBtn.innerHTML = `<a class="btn btn-primary" onclick='window.localStorage.removeItem("user");window.localStorage.removeItem("token"); window.location.reload();'>Cerrar sesion</a>`
  } else {
    loginBtn.innerHTML = `<a href="/login" class="btn btn-primary">Iniciar sesion</a>`
  }
}
