// Constantes para establecer comunicación con la API
const API_FAQS = 'http://34.125.139.5/app/api/public/faqs.php?action=';

// Función manejadora de eventos, para ejecutar justo cuando termine de cardar.
document.addEventListener('DOMContentLoaded', () => {
    readAllFaqs();
})

function readAllFaqs() {
    fetch(API_FAQS + 'readAll', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    let content = '';
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se crean y concatenan los acordeones donde van las FAQ's.
                        // content += `

                        //     <div class="accordion" id="accordionExample">
                        //         <div class="card">
                        //             <div class="card-header" id="headingOne">
                        //                 <h2 class="mb-0">
                        //                     <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" 
                        //                     data-target="#${row.pregunta}" aria-expanded="true" aria-controls="${row.pregunta}">
                        //                     ${row.pregunta}
                        //                     </button>
                        //                 </h2>
                        //             </div>
                        //             <div id="${row.pregunta}" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                        //                 <div class="card-body">
                        //                     ${row.respuesta}
                        //             </div>
                        //         </div>
                        //     </div>
                        //     `;
                        // content += `
                        // <div class="accordion">
                        //     <div class="card">
                        //         <div class="card-header" id="faq">
                        //             <h2 class="mb-0">
                        //                 <button class="btn btn-link btn-block text-left text-dark" type="button" data-toggle="collapse" data-target="respuesta" aria-expanded="true" aria-controls="respuesta">
                        //                     <b>${row.pregunta}</b>
                        //                 </button>
                        //             </h2>
                        //         </div>

                        //         <div id="respuesta" class="collapse show" aria-labelledby="faq" data-parent="#accordionExample">
                        //             <div class="card-body">
                        //                 <p>${row.respuesta}</p>
                        //             </div>
                        //         </div>
                        //     </div>
                        // </div>
                        // `;
                        //     content += `
                        //         <div class="card" style="width: 18rem;" id="headingOne">
                        //             <div class="card-body">
                        //                 <h5 class="card-title">${row.pregunta}</h5>
                        //                 <div class="separator"></div>
                        //                 <p class="card-text">${row.respuesta}</p>
                        //             </div>
                        //     </div>
                        //   `;
                        content += `
                        <div class="row justify-content-flex-star" id="pregunta">
                            <h4> <b>${row.pregunta}</b></h4>
                        </div>
                        <div class="row justify-content-flex-star">
                            <p>${row.respuesta}</p>
                        </div>
                        `;
                    });
                    // Se agregan las tarjetas a la etiqueta div mediante su id para mostrar las categorías.
                    document.getElementById('faqs').innerHTML = content;
                } else {
                    // Se presenta un mensaje de error cuando no existen datos para mostrar.
                    // document.getElementById('title').innerHTML = `<i class="material-icons small">cloud_off</i><span class="red-text">${response.exception}</span>`;
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
}