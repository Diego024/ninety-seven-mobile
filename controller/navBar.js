let isCategoriasMostradas = false;

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