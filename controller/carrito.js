const API_ORDENES = 'http://34.125.139.5/app/api/public/ordenes.php?action=';
const API_CATALOGO = 'http://34.125.139.5/app/api/public/catalogo.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    //Se llama a la función para mostrar los datos de carrito
    readCarrito();
    //Se llama a la función para mostrar las categorías disponibles
    readAllCategories();
    //Se llama a la función para mostrar la información del pedido
    readOrderInfo()
});

document.getElementById('save-form').addEventListener('submit', event => {
    event.preventDefault();
    saveRow(API_ORDENES, 'makeOrder', 'save-form', 'modal-form', true);
    
    $('#carrito-container').empty();
    document.getElementById('quantity-products').innerHTML = `Subtotal (0 Productos) :`;
    document.getElementById('total').innerHTML = `$0`;
    readCarrito();
})

const openCreateDialog = () => {
    //Se abre el form
    $('#modal-form').modal('show');
}

const readCarrito = () => {
    //Se realiza la petición a la API
    fetch(API_ORDENES + 'readCarrito')
    .then( request => {
        //Verificamos que la request se completó correctamente
        if(request.ok) {
            // console.log(request.text())
            return request.json()
        } else {
            console.log(`${request.status}  ${request.statusText}`);
        }
    }).then( resp => {
        //Se comprueba si la request es satisfactoria
        if(resp.status) {
            //Se define la variable en la cuál guardaremos la información de los productos
            let content = ''

            resp.dataset.map( row => {
                content+= `
                    <div class="card mb-3" style="max-width: 100%;">
                        <div class="row no-gutters">
                            <div class="col-md-4">
                                <img src="../resources/imageFiles/catalogo/${row.foto_producto}" alt="..." class="producto--img" >
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <div class="carta--contenedor__titulo">
                                        <a href="producto.html?id=${row.id_catalogo_producto}"><h5 class="card-title card--titulo">${row.catalogo_producto}</h5></a>
                                        <p>$${row.precio_venta}</p>
                                    </div>
                                    
                                    <div class="form-group col-md-4">
                                        <label for="inputState">Cantidad: </label>
                                        <input class="w-75" name="cantidad" id="cantidad" value="${row.cantidad}" type="number" readonly>

                                        <div class="carrito--enlace__contenedor">
                                            <a onclick=deleteDetail('${row.id_detalle_orden}') class="carrito--enlace"><p>Eliminar producto</p></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            })
            //Se asignan los comentarios al contenedor
            document.getElementById('carrito-container').innerHTML = content
        } else {
            document.getElementById('carrito-container').innerHTML = `<h4 class=" text-center mt-4">${resp.exception}</h4>`;
        }
    }).catch(function (error) {
        console.log(error);
    });
}

const readOrderInfo = () => {
    //Se realiza la petición a la API
    fetch(API_ORDENES + 'readOrderInfo')
    .then( request => {
        //Verificamos que la request se completó correctamente
        if(request.ok) {
            // console.log(request.text())
            return request.json()
        } else {
            console.log(`${request.status}  ${request.statusText}`);
        }
    }).then( resp => {
        //Se comprueba si la request es satisfactoria
        if(resp.status) {
            if(resp.dataset[0].totalproductos) {
                document.getElementById('quantity-products').innerHTML = `Subtotal (${resp.dataset[0].totalproductos} Productos) :`;
                document.getElementById('total').innerHTML = `$${resp.dataset[0].sum}`;
            } else {
                document.getElementById('quantity-products').innerHTML = `Subtotal (0 Productos) :`;
                document.getElementById('total').innerHTML = `$0`;
            }
        } else {
            document.getElementById('carrito-container').innerHTML = `<h4 class=" text-center mt-4">${resp.exception}</h4>`;
        }
    }).catch(function (error) {
        console.log(error);
    });
}

const deleteDetail = id => {
    swal({
        title: 'Advertencia',
        text: '¿Desea eliminar el producto del carrito?',
        icon: 'warning',
        buttons: ['No', 'Sí'],
        closeOnClickOutside: false,
        closeonEsc: false,
    }).then( value => {
        if(value) {
            //Se crea una constante con los datos del registro
            const data = new FormData();
            data.append('id_orden_detalle', id);

            fetch(API_ORDENES + 'deleteDetail', {
                method: 'post',
                body: data
            }).then( request => {
                //Verificando que la request sea correcta
                if(request.ok) {
                    // console.log(request.text())
                    return request.json()
                } else {
                    console.log(`${request.status} ${request.statusText}`)
                }
            }).then( response => {
                //Se comprueba que el status de la request sea satisfactorio
                if(response.status) {
                    //Se recarga la vista de los registros en la tabla
                    sweetAlert(1, response.message, null);
                    readCarrito();
                    readOrderInfo();
                } else {
                    sweetAlert(2, response.exception, null);
                }
            }).catch(error => {
                console.log(error)
            })

        }
    })
}
