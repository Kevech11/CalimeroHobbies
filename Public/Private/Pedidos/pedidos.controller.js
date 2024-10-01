const pedidos = [
    { id: '001', nombre: 'Juan Pérez', email: 'juan.perez@example.com',asunto: 'Envio', mensaje: 'Enviar lo antes posible.' },
    { id: '002', nombre: 'Ana López', email: 'ana.lopez@example.com', asunto: 'Color',mensaje: 'Color rojo, por favor.' },
    { id: '003', nombre: 'Carlos González', email: 'carlos.gonzalez@example.com', asunto: 'Regalo',mensaje: 'Es un regalo.' }
];

// Función para agregar pedidos a la tabla
function agregarPedidoATabla(pedido) {
    const tabla = document.getElementById('pedidosBody');
    const fila = document.createElement('tr');

    fila.innerHTML = `
        <td>${pedido.id}</td>
        <td>${pedido.nombre}</td>
        <td>${pedido.email}</td>
        <td>${pedido.asunto}</td>
        <td>${pedido.mensaje}</td>
    `;

    tabla.appendChild(fila);
}

// Simulando la llegada de pedidos uno por uno cada 2 segundos
let contador = 0;
const intervalo = setInterval(() => {
    if (contador < pedidos.length) {
        agregarPedidoATabla(pedidos[contador]);
        contador++;
    } else {
        clearInterval(intervalo); // Detiene el intervalo cuando ya no hay más pedidos
    }
}, 2000);



const loginBtn = document.getElementById("loginBtn")

if (loginBtn) {
  if (window.localStorage.getItem("user")) {
    loginBtn.innerHTML = `<a class="btn btn-primary" onclick='window.localStorage.removeItem("user"); window.location.reload();'>Cerrar sesion</a>`
  } else {
    loginBtn.innerHTML = `<a href="/login" class="btn btn-primary">Iniciar sesion</a>`
  }
}