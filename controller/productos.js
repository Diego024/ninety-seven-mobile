const API_CATALOGO = 'http://34.125.139.5/app/api/public/catalogo.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    //Se busca en la URL los parámetros disponibles
    const params = new URLSearchParams(location.search);
    //Se obtienen los datos localizados por medio de las variables
    const ID = params.get('id');
    const NAME = params.get('nombre')
    //Se llama a la función para mostrar los productos de la categoría
    readProductosCategoria(ID, NAME);
    //Se llama a la función para mostrar las categorías disponibles
    readAllCategories();
});


const readProductosCategoria = (id, categoria) => {
    //Se define un objeto con los datos del registro seleccionado
    const data = new FormData();
    data.append('id_categoria', id);

    //Se realiza la petición a la API
    fetch(API_CATALOGO + 'readProductosCategoria', {
        method: 'post',
        body: data
    }).then(request => {
        if (request.ok) {
            // console.log(request.text())
            return request.json()
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).then(resp => {
        if (resp.status) {
            //Se define la variable en la cuál guardaremos la información de los productos
            let content = ''
            //Se recorre la respuesta con la función map
            resp.dataset.map(row => {
                content += `
                    <div class="col mb-4">
                        <div class="card text-center" style="width: 20rem;">
                            <a href="producto.html?id=${row.id_catalogo_producto}">
                                <img src="../resources/imageFiles/catalogo/${row.foto_producto}" class="card-img-top" alt="...">
                            </a>
                            <div class="card-body">
                                <a href="Producto.php?id=${row.id_catalogo_producto}"><h5 class="card-title">${row.catalogo_producto}</h5></a>
                                <p class="card-text">${row.precio_venta}</p>
                                ${/*<a href="#" class="btn btn-danger" id="btn_card">Añadir al carrito</a>*/' '}
                            </div>
                        </div>
                    </div>
                `;
                // Se asigna como título la categoría de los productos.
                document.getElementById('title').textContent = categoria;
                // Se asigna la descripción de la categoría
                document.getElementById('description').textContent = resp.dataset[0].descripcion_categoria
                //Se agrega la imagen al jumbotron
                const jumbo = document.getElementById('jumbo-Vestidos')
                // jumbo.style.backgroundImage = `url(../resources/imageFiles/categorias/${resp.dataset[0].foto_categoria})`
                // Se agregan las tarjetas a la etiqueta div mediante su id para mostrar los productos.
                document.getElementById('productos').innerHTML = content;
            })
        } else {
            // Se presenta un mensaje de error cuando no existen datos para mostrar.
            document.getElementById('title').innerHTML = `<span class="red-text">${resp.exception}</span>`;
        }
    })
}