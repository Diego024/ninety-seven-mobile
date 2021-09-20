const API_CATALOGO = 'http://34.125.139.5/app/api/public/catalogo.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
   //Se llama a la función para mostrar las categorías disponibles
   readAllCategories();
   //Se llama a la función para mostrar los favoritos
   readFavoritos();
});

const readAllCategories = () => {
    fetch(API_CATALOGO + 'readAll')
    .then( request => {
        if( request.ok ) {
            // console.log(request.text())
            return request.json()
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    })
    .then( resp => {
        if( resp.status ) {
            //Se declara la varibale para mostrar los datos
            let content = ''
            //Se declara la variable para asignarle el link a cada categoría
            let url = ''
            //Se recorre el arreglo con de las categorías, con la función map
            resp.dataset.map( row => {
                //Se define la URL de la categoría
                url = `productos.php?id=${row.id_categoria}&nombre=${row.categoria}`
                //Se crean las opciones del nav y se concatenan al content
                content += `
                    <a href="${url}" class="categoria">${row.categoria}</a>
                `;
            })
            //Se agregan las opciones al navbar
            document.getElementById('categories').innerHTML = content
        } else {
            // Se presenta un mensaje de error cuando no existen datos para mostrar.
            document.getElementById('categories').innerHTML = `<p>No se han registrado categorías</p>`;
        }
    }).catch(function (error) {
        console.log(error);
    });
}

const readFavoritos = () => {
    fetch(API_CATALOGO + 'readFavoritos')
    .then( request => {
        if( request.ok ) {
            // console.log(request.text())
            return request.json()
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    })
    .then( resp => {
        if( resp.status ) {
            //Se declara la varibale para mostrar los datos
            let content = '' 
            //Se recorre el arreglo con de las categorías, con la función map
            resp.dataset.map( row => {
                content += `
                <div class="col mb-4">
                    <div class="card text-center" style="width: 20rem;">
                        <a href="Producto.php?id=${row.id_catalogo_producto}">
                            <img src="../../resources/imageFiles/dashboard/catalogo/${row.foto_producto}" class="card-img-top" alt="...">
                        </a>
                        <div class="card-body">
                            <a href="Producto.php?id=${row.id_catalogo_producto}"><h5 class="card-title">${row.catalogo_producto}</h5></a>
                            <p class="card-text">${row.precio_venta}</p>
                            <a onclick=eliminarFavorito(${row.id_catalogo_producto}) id="btn_eliminar"><b>Eliminar de favoritos</b></a>
                            ${/*<a href="#" class="btn btn-danger" id="btn_card">Añadir al carrito</a>*/' '}
                        </div>
                    </div>
                </div>
            `;
            })
            //Se agregan las opciones al navbar
            document.getElementById('favoritos-container').innerHTML = content
        } else {
            // Se presenta un mensaje de error cuando no existen datos para mostrar.
            document.getElementById('favoritos-container').innerHTML = `<h4 class="text-center">No se han registrado favoritos</h4>`;
        }
    }).catch(function (error) {
        console.log(error);
    });
}

const eliminarFavorito = id => {
    //Se crea una variable para guardar el id del producto para usarlo en la request
    const data = new FormData;
    data.append('id_catalogo_producto', id);
    //Se realiza la request
    fetch(API_CATALOGO + 'deleteFavorito', {
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
            //Se muestran los favoritos
            readFavoritos();
        } else {
            sweetAlert(2, response.exception, null);
        }
    }).catch(error => {
        console.log(error)
    })
}