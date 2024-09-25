const loginBtn = document.getElementById("loginBtn")

if (loginBtn) {
  if (window.localStorage.getItem("user")) {
    loginBtn.innerHTML = `<a class="btn btn-primary" onclick='window.localStorage.removeItem("user"); window.location.reload();'>Cerrar sesion</a>`
  } else {
    loginBtn.innerHTML = `<a href="/login" class="btn btn-primary">Iniciar sesion</a>`
  }
}

// Obtener el formulario y la tabla
const clienteForm = document.getElementById('clienteForm');
const clientesTable = document.getElementById('clientesTable').getElementsByTagName('tbody')[0];

// Escuchar el evento de envío del formulario
clienteForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío del formulario

    // Obtener los valores de los campos
    const id = document.getElementById('id').value;
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const pais = document.getElementById('pais').value;
    const localidad = document.getElementById('localidad').value;
    const direccion = document.getElementById('direccion').value;
    const telefono = document.getElementById('telefono').value;

    // Crear una nueva fila y agregar los valores
    const newRow = clientesTable.insertRow();
    newRow.insertCell(0).textContent = id;
    newRow.insertCell(1).textContent = nombre;
    newRow.insertCell(2).textContent = apellido;
    newRow.insertCell(3).textContent = pais;
    newRow.insertCell(4).textContent = localidad;
    newRow.insertCell(5).textContent = direccion;
    newRow.insertCell(6).textContent = telefono;

    // Crear celda de acciones y botón de eliminar
    const actionsCell = newRow.insertCell(7);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.className = 'btn-delete';
    actionsCell.appendChild(deleteButton);

    // Añadir evento de eliminación al botón
    deleteButton.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            clientesTable.deleteRow(newRow.rowIndex - 1);
        }
    });

    // Limpiar los campos del formulario
    clienteForm.reset();
});