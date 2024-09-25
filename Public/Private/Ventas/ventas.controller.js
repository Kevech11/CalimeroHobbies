document.getElementById('ventaForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const producto = document.getElementById('producto').value;
    const fecha = document.getElementById('fecha').value;
    const cantidad = document.getElementById('cantidad').value;
    const precio = document.getElementById('precio').value;
    const cliente = document.getElementById('cliente').value;

    // Agregar nueva fila a la tabla
    const table = document.getElementById('ventasTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const cellProducto = newRow.insertCell(0);
    const cellFecha= newRow.insertCell(1);
    const cellCantidad = newRow.insertCell(2);
    const cellPrecio = newRow.insertCell(3);
    const cellCliente = newRow.insertCell(4);
    const cellAcciones = newRow.insertCell(5);

    cellProducto.innerText = producto;
    cellFecha.innerText = fecha;
    cellCantidad.innerText = cantidad;
    cellPrecio.innerText = precio;
    cellCliente.innerText = cliente;

    // Crear botones de acción
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Eliminar';
    deleteBtn.classList.add('action-btn');
    deleteBtn.addEventListener('click', function() {
        table.deleteRow(newRow.rowIndex - 1);
    });

    const printBtn = document.createElement('button');
    printBtn.innerText = 'Imprimir';
    printBtn.classList.add('print-btn');
    printBtn.addEventListener('click', function() {
        imprimirVenta(producto, fecha, cantidad, precio, cliente);
    });

    cellAcciones.appendChild(deleteBtn);
    cellAcciones.appendChild(printBtn);

    // Limpiar el formulario
    document.getElementById('ventaForm').reset();
});

function imprimirVenta(producto, fecha, cantidad, precio, cliente) {
    const contenido = `Producto: ${producto}\nFecha: ${fecha}\nCantidad: ${cantidad}\nPrecio: ${precio}\nCliente: ${cliente}`;
    const ventanaImpresion = window.open('', '', 'height=500, width=500');
    ventanaImpresion.document.write('<pre>' + contenido + '</pre>');
    ventanaImpresion.document.close();
    ventanaImpresion.print();
}