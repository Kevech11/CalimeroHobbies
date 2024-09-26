// Obtener el formulario y la tabla
const ventaForm = document.getElementById('ventaForm');
const ventasTable = document.getElementById('ventasTable').getElementsByTagName('tbody')[0];

// Escuchar el evento de envío del formulario
ventaForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío del formulario                                        

    // Obtener los valores de los campos
    const cliente = document.getElementById('cliente').value;
    const producto = document.getElementById('producto').value;
    const cantidad = document.getElementById('cantidad').value;
    const total = document.getElementById('total').value;

    // Crear una nueva fila y agregar los valores
    const newRow = ventasTable.insertRow();
    newRow.insertCell(0).textContent = cliente;
    newRow.insertCell(1).textContent = producto;
    newRow.insertCell(2).textContent = cantidad;
    newRow.insertCell(3).textContent = total;

    // Crear celda de acciones
    const actionsCell = newRow.insertCell(4);

    // Botón de eliminar
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.className = 'btn-delete';
    actionsCell.appendChild(deleteButton);

    // Añadir evento de eliminación al botón
    deleteButton.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
            ventasTable.deleteRow(newRow.rowIndex - 1);
        }
    });

    // Botón de imprimir
    const printButton = document.createElement('button');
    printButton.textContent = 'Imprimir';
    printButton.className = 'btn-print';
    actionsCell.appendChild(printButton);

    // Añadir evento de impresión al botón
    printButton.addEventListener('click', function() {
        const ventaInfo = `
            Cliente: ${cliente}
            Producto: ${producto} 
            Cantidad: ${cantidad}
            Total: ${total}
        `;
        const win = window.open('', '', 'height=400,width=600');
        win.document.write('<html><head><title>Imprimir Venta/title></head><body>');
        win.document.write('<pre>' + ventaInfo + '</pre>');
        win.document.write('</body></html>');
        win.document.close();
        win.print();
    });

    // Limpiar los campos del formulario
    ventaForm.reset();
});