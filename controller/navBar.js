const API_CATALOGO_NAVBAR = 'http://34.125.139.5/app/api/public/catalogo.php?action=';
let isCategoriasMostradas = false;

// Función manejadora de eventos, para ejecutar justo cuando termine de cardar.
document.addEventListener('DOMContentLoaded', () => {
    //Se llama a la función para mostrar las categorías disponibles
    readAllCategories();
})

var mostrarCategorias = () => {
    const categorias = document.getElementById('categories')
    
    if(window.innerWidth <= 660) {
        if(isCategoriasMostradas) {
            categorias.classList.add('menu--hidden')
            isCategoriasMostradas = false;
        } else {
            categorias.classList.remove('menu--hidden')
            isCategoriasMostradas = true;
        }
    }
}

let btnCategorias = document.querySelector('.menu--titulo');
btnCategorias.addEventListener('click', mostrarCategorias);

const readAllCategories = () => {
    fetch(API_CATALOGO_NAVBAR + 'readAll')
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
                url = `productos.html?id=${row.id_categoria}&nombre=${row.categoria}`
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
            // document.getElementById('categories').innerHTML = `${resp.exception}`;
        }
    }).catch(function (error) {
        console.log(error);
    });
}