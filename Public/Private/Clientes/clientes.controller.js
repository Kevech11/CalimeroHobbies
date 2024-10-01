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
    const provincia = document.getElementById('provincia').value;
    const localidad = document.getElementById('localidad').value;
    const direccion = document.getElementById('direccion').value;
    const telefono = document.getElementById('telefono').value;

    // Crear una nueva fila y agregar los valores
    const newRow = clientesTable.insertRow();
    newRow.insertCell(0).textContent = id;
    newRow.insertCell(1).textContent = nombre;
    newRow.insertCell(2).textContent = apellido;
    newRow.insertCell(3).textContent = pais;
    newRow.insertCell(4).textContent = provincia;
    newRow.insertCell(5).textContent = localidad;
    newRow.insertCell(6).textContent = direccion;
    newRow.insertCell(7).textContent = telefono;

    // Crear celda de acciones y botones de eliminar y editar
    const actionsCell = newRow.insertCell(8);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.className = 'btn-delete';
    
    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.className = 'btn-edit';
    
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    // Añadir evento de eliminación al botón
    deleteButton.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            clientesTable.deleteRow(newRow.rowIndex - 1);
        }
    });

    // Añadir evento de edición al botón
    editButton.addEventListener('click', function() {
        if (editButton.textContent === 'Editar') {
            // Habilitar la edición
            for (let i = 0; i < 8; i++) {
                const cell = newRow.cells[i];
                const input = document.createElement('input');
                input.type = 'text';
                input.value = cell.textContent;
                cell.textContent = '';
                cell.appendChild(input);
            }
            editButton.textContent = 'Guardar';
        } else {
            // Guardar los cambios
            for (let i = 0; i < 8; i++) {
                const cell = newRow.cells[i];
                const input = cell.querySelector('input');
                cell.textContent = input.value;
            }
            editButton.textContent = 'Editar';
        }
    });
    clienteForm.reset();
});

const loginBtn = document.getElementById("loginBtn")

if (loginBtn) {
  if (window.localStorage.getItem("user")) {
    loginBtn.innerHTML = `<a class="btn btn-primary" onclick='window.localStorage.removeItem("user"); window.location.reload();'>Cerrar sesion</a>`
  } else {
    loginBtn.innerHTML = `<a href="/login" class="btn btn-primary">Iniciar sesion</a>`
  }
}
