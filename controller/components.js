// Este archivo es de uso general en todas las páginas web. Se importa en las plantillas del pie del documento.

// Función para listar los registros de una tabla
const readRows = api => {
    fetch(api + 'readAll', {
        method: 'get',
    })
    .then(request => {
        if (request.ok) {
            //console.log(request.text())
            return request.json()
        } else {

            console.log(`${request.status} ${request.statusText}`);
        }
    })
    .then(response => {
        let data = []
        //Se comprueba que el status de la request sea satisfactorio
        if (response.status) {
            data = response.dataset;
        } else {
            sweetAlert(4, response.exception, null)
        }
        //Se envían los datos al controlador para que llene la tabla
        fillTable(data)
    })
    .catch(error => {

        console.log(error);
    })
}

//Función para búsqueda
function searchRows(api, form) {
    fetch(api + 'search', {
        method: 'post',
        body: new FormData(document.getElementById(form))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            // console.log(request.text())
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se envían los datos a la función del controlador para que llene la tabla en la vista.
                    fillTable(response.dataset);
                    sweetAlert(1, response.message, null);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
}

//Funciones para crear o actualizar un registro.
const saveRow = (api, action, form, modal, isNotTable) => {
    // let formulario = new FormData(document.getElementById(form)).entries();
    // for(value of formulario) {
    //     console.log(value)
    // }
    fetch(api + action, {
        method: 'post',
        body: new FormData(document.getElementById(form))
    })
    .then(request => {
        //Se verifica que la request se completó correctamente
        if (request.ok) {
            // console.log(request.text())
            return request.json()
        } else {
            console.log(`${request.status} ${request.statusText}`)
        }
    })
    .then(response => {
        //Se comprueba que el status de la request sea satisfactorio
        if (response.status) {
            //Se cierra el modal, solo si se recibe un modal
            if (modal) {
                $(`#${modal}`).modal('hide');
            }
            if (!isNotTable) {
                readRows(api)
            }
            sweetAlert(1, response.message, null)
        } else {
            sweetAlert(2, response.exception, null)
        }
    }).catch(error => {
        console.log(error)
    })
}

// Función para confirmar que desea eliminar un registro
const confirmDelete = (api, data) => {
    swal({
        title: 'Advertencia',
        text: '¿Desea eliminar el registro?',
        icon: 'warning',
        buttons: ['No', 'Sí'],
        closeOnClickOutside: false,
        closeonEsc: false,
    }).then(value => {
        if (value) {
            fetch(api + 'delete', {
                method: 'post',
                body: data
            }).then(request => {
                //Verificando que la request sea correcta
                if (request.ok) {
                    //console.log(request.text())
                    return request.json()
                } else {
                    console.log(`${request.status} ${request.statusText}`)
                }
            }).then(response => {
                //Se comprueba que el status de la request sea satisfactorio
                if (response.status) {
                    //Se recarga la vista de los registros en la tabla
                    sweetAlert(1, response.message, null);
                    readRows(api);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            }).catch(error => {
                console.log(error)
            })

        }
    })
}

const sweetAlert = (type, text, url) => {
    switch (type) {
        case 1:
            title = 'Éxito'
            icon = 'success'
            break;
        case 2:
            title = 'Error'
            icon = 'error'
            break;
        case 3:
            title = 'Advertencia'
            icon = 'warning'
            break;
        case 4:
            title = 'Aviso'
            icon = 'info'
            break;
    }
    // Se verifica si existe una url, de ser así, se controla
    if (url) {
        swal({
            title,
            text,
            icon,
            button: 'Aceptar',
            closeOnClickOutside: false,
            closeOnEsc: false
        })
            .then(() => {
                location.href = url
            })
    } else {
        swal({
            title,
            text,
            icon,
            button: 'Aceptar',
            closeOnClickOutside: false,
            closeOnEsc: false
        })
    }
}

// Función para cargar las opciones en un select de formulario.
const fillSelect = (endpoint, select, selected) => {
    fetch(endpoint)
        .then(request => {
            if (request.ok) {
                // console.log(request.text())
                return request.json()
            } else {
                console.log(`${request.status} ${request.statusText}`)
            }
        }).then(response => {
            let content = ''
            //Se verifica que la request se completó correctamente
            if (response.status) {
                if (!selected) {
                    content += '<option disabled selected>Selecione una opción</option>'
                }
                //Se recorre el dataset del response
                response.dataset.map(row => {
                    //Se obtiene el valor del primer campo del script
                    value = Object.values(row)[0]
                    //Se obtiene el valor del segundo campo del script
                    text = Object.values(row)[1];
                    // Se verifica si el valor de la API es diferente al valor seleccionado para enlistar una opción, de lo contrario se establece la opción como seleccionada.
                    if (value != selected) {
                        content += `<option value="${value}">${text}</option>`
                    } else {
                        content += `<option value="${value}" selected>${text}</option>`
                    }
                })
            } else {
                content += '<option>No hay opciones disponibles</option>';
            }
            //Se agregan las opciones a la etiqueta select mediante su id
            document.getElementById(select).innerHTML = content

        }).catch(error => {
            console.log(error)
        })
}

const API_ADMIN_PICTURE = '../../app/api/dashboard/administradores.php?action=getAdminPicture';

const setInfoAdmin = () => {
    fetch(API_ADMIN_PICTURE)
        .then(request => {
            if (request.ok) {
                // console.log(request.text())
                return request.json()
            } else {
                console.log(`${request.status} ${request.statusText}`)
            }
        })
        .then(response => {
            //Se comprueba que el status de la request sea satisfactorio
            if (response.status) {
                const picturePath = '../../resources/imageFiles/dashboard/administradores/'

                document.getElementById('info--img__user').src = `${picturePath}${response.dataset[0].foto_administrador}`
                document.getElementById('admin--name').innerHTML = response.dataset[0].usuario
            } else {
                sweetAlert(4, response.exception, null)
            }
        })
        .catch(error => {
            console.log(error);
        })
}

const setSearchLink = () => {
    if (document.getElementById('input-search').value) {
        document.getElementById('input-button').setAttribute('href', `busqueda.php?search=${document.getElementById('input-search').value}`);
    } else {
        sweetAlert(3, 'Primero tiene que ingresar algo para buscar')
    }
}

document.getElementById('input-search').addEventListener('keypress', event => {
    if (event.charCode === 13) {
        event.preventDefault();
        document.getElementById('input-button').click();
    }
})

function lineGraph(canvas, xAxis, yAxis, legend, title) {
    // Se define el canva donde se dibujará el gráfico
    const context = document.getElementById(canvas).getContext('2d');
    // Se crea una instancia para generar la gráfica con los datos recibidos.
    const chart = new Chart(context, {
        type: 'line',
        data: {
            labels: xAxis,
            datasets: [{
                label: legend,
                data: yAxis,
                fill: false,
                tension: 0.1,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgb(255, 99, 132)',
            }]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
                display: false
            },
            title: {
                display: true,
                text: title
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        precision: 0
                    }
                }]
            }
        },
    })
}

function barGraph(canvas, xAxis, yAxis, legend, title) {
    // Se define el canva donde se dibujará el gráfico
    const context = document.getElementById(canvas).getContext('2d');
    // Se crea una instancia para generar la gráfica con los datos recibidos.
    const chart = new Chart(context, {
        type: 'bar',
        data: {
            labels: xAxis,
            datasets: [{
                label: legend,
                data: yAxis,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)',
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
                display: false
            },
            title: {
                display: true,
                text: title
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        precision: 0
                    }
                }]
            }
        },
    })
}

function donutGraph(canvas, xAxis, yAxis, legend, title) {
    // Se define el canva donde se dibujará el gráfico
    const context = document.getElementById(canvas).getContext('2d');
    // Se crea una instancia para generar la gráfica con los datos recibidos.
    const chart = new Chart(context, {
        type: 'doughnut',
        data: {
            labels: xAxis,
            datasets: [{
                label: 'Usuarios que más pedidos han realizado',
                data: yAxis,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)',
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                ],
            }]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
                display: false
            },
            title: {
                display: true,
                text: title
            },
        },
    })
}

function pieGraph(canvas, xAxis, yAxis, legend, title) {
    // Se define el canva donde se dibujará el gráfico
    const context = document.getElementById(canvas).getContext('2d');
    // Se crea una instancia para generar la gráfica con los datos recibidos.
    const chart = new Chart(context, {
        type: 'pie',
        data: {
            labels: xAxis,
            datasets: [{
                label: 'Usuarios que más pedidos han realizado',
                data: yAxis,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)',
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                ],
            }]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
                display: false
            },
            title: {
                display: true,
                text: title
            },
        },
    })
}
