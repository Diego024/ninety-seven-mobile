const API_CATALOGO = 'http://34.125.139.5/app/api/public/catalogo.php?action=';
const API_ORDENES = 'http://34.125.139.5/app/api/public/ordenes.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    //Se busca en la URL los parámetros disponibles
    const params = new URLSearchParams(location.search);
    //Se obtienen los datos localizados por medio de las variables
    const ID = params.get('id');
    //Se llama a la función para mostrar la información del producto
    readProductInfo(ID)
    //Se llama a la función para mostrar los comentarios del producto
    readCommentsProduct(ID)
    //Se llama a la función para mostrar las categorías disponibles
    readAllCategories();
    //Obteniendo el ID del producto para el FORM de comentarios
    document.getElementById('id_catalogo_producto').value = ID;
    //Obteniendo el ID del producto para el FORM de agregar al carrito
    document.getElementById('id_producto-carrito').value = ID;
});

const crearFavorito = () => {
    //Se busca en la URL los parámetros disponibles
    const params = new URLSearchParams(location.search);
    //Se obtienen los datos localizados por medio de las variables
    const ID = params.get('id');
    
    //Se crea una variable para guardar el id del producto para usarlo en la request
    const data = new FormData;
    data.append('id_catalogo_producto', ID);
    //Se realiza la request
    fetch(API_CATALOGO + 'createFavorito', {
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
        } else {
            sweetAlert(2, response.exception, null);
        }
    }).catch(error => {
        console.log(error)
    })
}

const readCommentsProduct = id => {
    //Se crea una constante con los datos del registro
    const data = new FormData();
    data.append('id_catalogo_producto', id)

    //Se realiza la petición a la API
    fetch(API_CATALOGO + 'readCommentsProduct', {
        method: 'post',
        body: data
    }).then( request => {
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
                <div class="col-sm-12">
                    <div class="media mt-4">
                        <div class="media-body">
                            <div class="d-flex flex-row">
                                <h5 class="mt-0">${row.nombre}</h5>
                                <i class="text-muted"> &nbsp; ${row.valoracion}/10 </i>
                                <i class="text-muted"> &nbsp; ${row.fecha_comentario} </i>
                            </div>
                            <p>${row.comentario}</p>
                        </div>
                    </div>
                </div>
                `;
            })
            //Se asignan los comentarios al contenedor
            document.getElementById('comments-container').innerHTML = content
        } else {
            document.getElementById('comments-container').innerHTML = `<span class="red-text">${resp.exception}</span>`;
        }
    }).catch(function (error) {
        console.log(error);
    });
}

const readProductInfo = (id) => {
    //Se crea una constante con los datos del registro
    const data = new FormData();
    data.append('id_catalogo_producto', id)

    //Se realiza la petición a la API
    fetch(API_CATALOGO + 'readOneProduct', {
        method: 'post',
        body: data
    }).then( request => {
        //Verificamos que la request se completó correctamente
        if(request.ok) {
            return request.json()
        } else {
            console.log(`${request.status}  ${request.statusText}`);
        }
    }).then( resp => {
        //Se comprueba si la request es satisfactoria
        if(resp.status) {
            document.getElementById('catalogo_producto').innerHTML = resp.dataset[0].catalogo_producto
            document.getElementById('precio').innerHTML = `$${resp.dataset[0].precio_venta}`
            document.getElementById('producto-descripcion').innerHTML = resp.dataset[0].descripcion
            document.getElementById('cantidad').max = resp.dataset[0].existencia
            document.getElementById('producto--img').src = `../resources/imageFiles/catalogo/${resp.dataset[0].foto_producto}`
        } else {
            sweetAlert(2, resp.exception, null);
        }
    }).catch(function (error) {
        console.log(error);
    });
}

//Función para manejar el evento de enviar el form
document.getElementById('comment-form').addEventListener('submit', event => {
    //Se evita que se recargue la página
    event.preventDefault();

    saveRow(API_CATALOGO, 'createComment', 'comment-form');

    const params = new URLSearchParams(location.search);
    //Se obtienen los datos localizados por medio de las variables
    const ID = params.get('id');
    readCommentsProduct(ID)
    document.getElementById('comentario').value = null;
    document.getElementById('valoracion').value = null;
})

//Función para menejar el evento de agregar al carrito
document.getElementById('carrito-form').addEventListener('submit', event => {
    //Se evita que se recargue la página
    event.preventDefault();

    saveRow(API_ORDENES, 'createDetail', 'carrito-form', null, true)
    document.getElementById('cantidad').value = null;

})