// Constantes para establecer comunicación con la API
const API_HISTORIAL = 'http://34.125.139.5/app/api/public/historial.php?action=';

// Función manejadora de eventos, para ejecutar justo cuando termine de cardar.
document.addEventListener('DOMContentLoaded', () => {
    readRows(API_HISTORIAL);
    fillTableDetalle();
})

// Función para llenar la tabla con los datos de los registros. Se usa en la función readRows()
const fillTable = dataset => {
    $('#warning-message').empty();
    $('#tbody-rows').empty();
    let content = ''
    if (dataset == [].length) {
        //console.log(dataset)
        content += `<h4>No hay pedidos registrados</h4>`
        document.getElementById('warning-message').innerHTML = content
    } else {
        //Se agregan los titulos de las columnas
        content += `
            <tr>
                <th>Código</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Detalle</th>
            </tr>
        `
        dataset.map(row => {
            content += `
                <tr>
                    <td>${row.id_orden_compra}</td>
                    <td>${row.cliente}</td>
                    <td>${row.fecha_orden}</td>
                    <td>${row.total}</td>
                    <td>${row.estado_orden}</td>
                    <td>
                        <a href="../../app/reports/public/detallePedido.php?id=${row.id_orden_compra}" target="_blank" class="btn waves-effect amber tooltipped" data-tooltip="Reporte de productos"><i class="material-icons">assignment</i></a>
                    </td>
                </tr>
            `
        })
        content += `
            <tr>
                <th>Código</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Detalle</th>
            </tr>
        `
        //Se agrega el contenido a la tabla mediante su id
        document.getElementById('historial').innerHTML = content;
    }
}


const fillTableDetalle = dataset => {
    $('#warning-message').empty();
    $('#tbody-rows').empty();
    let content = ''
    if (dataset == [].length) {
        //console.log(dataset)
        content += `<h4>No hay pedidos registrados</h4>`
        document.getElementById('warning-message').innerHTML = content
    } else {
        //Se agregan los titulos de las columnas
        content += `
            <tr>
                <th>Pedido No.</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
            </tr>
        `
        dataset.map(row => {
            content += `
                <tr>
                    <td>${row.id_orden_compra}</td>
                    <td>${row.catalogo_producto}</td>
                    <td>${row.cantidad}</td>
                    <td>${row.subtotal}</td>
                </tr>
            `
        })
        content += `
            <tr>
                <th>Pedido No.</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
            </tr>
        `
        //Se agrega el contenido a la tabla mediante su id
        document.getElementById('tb_detalle').innerHTML = content;
    }
}

const openUpdateDialog = id => {
    //console.log(id)
    document.getElementById('modal-title').textContent = 'Detalle de la orden'

    const data = new FormData();
    data.append('id_orden_compra', id)

    fetch(API_PEDIDOS + 'readOne', {
        method: 'post',
        body: data
    })
    .then( request => {
        if(request.ok) {
            // console.log(request.text())
            return request.json()
        } else {
            console.log(`${request.status}  ${request.statusText}`);
        }
    }).then(response => {
        //console.log(response)
        if(response.status) {
            //console.log(response.dataset);
            document.getElementById('id_orden_compra').value = response.dataset[0].id_orden_compra
            document.getElementById('id_estado_orden').value = response.dataset[0].id_estado_orden
        } else {
            sweetAlert(2, response.exception, null);
        }
    }).catch( error => {
        console.error(error);
    })
}

//Evento ejecutado para preparar el form antes de hacer un insert
const openCreateDialog = () => {
    //Se abre el form
    $('#modal-form').modal('show');
    //Asignamos el titulo al modal
    document.getElementById('modal-title').textContent = 'Detalle de la orden'
}