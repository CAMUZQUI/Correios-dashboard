// En el archivo donde deseas usar initMap de act.js
//import { actMap } from './act.js';

/*
let labelsR = []; // Para las etiquetas del eje X
let datos = new Map(); // Mapa para almacenar los datos
let datosAjusT = []; // Para los datos de las rutas ajustados
let datosAjusV = [];  
let datosAjusE = [];
let max = [];
let min = [];
var atendimiento = 0;
*/

var rotaStats = "rotas_stats.json";
var cTot=0;
//let vectorColores = [];
let vectorColores =['hsl(179, 81%, 42%)', 'hsl(321, 100%, 46%)', 'hsl(99, 88%, 53%)', 'hsl(56, 97%, 51%)', 'hsl(0, 99%, 50%)'];

function initMap() {

    var tTot=0;
    var vTot=0;
    var eTot=0;
    var Ff=0;
    var Ge=0;
    var t=0;
    var Conv=false;
    var Pop=0;
    var Rm=0.0;
        
        
    const baseUrl = window.location.pathname;
    // Usar plantilla literal con backticks para incluir la variable en la cadena
    const jsonFilePath = `${baseUrl}static/json/map_styles.json`.replace('//', '/');
        
    fetch(jsonFilePath)
        .then(function(response) {
            return response.json();
        })
        
        .then(function(styles) {

            var mapOptions = {
                center: new google.maps.LatLng(-22.5646, -47.4017),      
                zoom: 15,          
                styles: styles,                
                // Ocultar controles por defecto
                disableDefaultUI: true,
                // Personalizar controles a mostrar
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_BOTTOM // Posición del control de zoom
                },
                fullscreenControl: true,
                fullscreenControlOptions: {
                    position: google.maps.ControlPosition.LEFT_TOP // Posición del control de zoom
                },
                scaleControl: true,                
                mapTypeControl: false,                
                streetViewControl: false,
                rotateControl: true,                
            };
        
            var map = new google.maps.Map(document.getElementById('map'), mapOptions);
            
            var jsonFilePathRotas = `${baseUrl}static/json/rotas.json`.replace('//', '/');
            
            fetch(jsonFilePathRotas)
              .then(response => response.json()) // Convierte la respuesta en JSON
              .then(data => {
              
                //console.log(data);
                  
                atendimiento = data.atendimento;
                var rotas = data.rotas;
                
                // Para valores totales de cada ruta (sumatorias)
                for (var i = 0; i < rotas.length; i++) {                    
                    tTot+=rotas[i].tempo;
                    vTot+=rotas[i].volume;
                    eTot+=rotas[i].entregas;
                    /*
                    //Por ahora se modifica porque no está en solución
                    data.rotas[i].tempo=Math.round(Math.random() * 2) + 5;
                    tTot+=data.rotas[i].tempo;
                    vTot+=rotas[i].volume;
                    eTot+=rotas[i].volume;
                    */
                    max.push(0.75);
                    min.push(0.25);                    
                }
                cTot=eTot;
                
                datos.set('Tempo', []);
                datos.set('Volume', []);
                datos.set('Entregas', []);
                                        
                //cTot=0;        
                // Iterar sobre todas las rutas
                for (var i = 0; i < rotas.length; i++) {
                
                    if(rotas.length>5) vectorColores.push(generarColor2());
                
                    // Servicio Directions para procesar 'request'
                    var directionsService = new google.maps.DirectionsService();                               
                    let directionsRenderer = new google.maps.DirectionsRenderer({
                        polylineOptions: {
                            strokeColor: vectorColores[i], // Puedes poner cualquier color en formato hexadecimal   
                            strokeOpacity: 1.0,                 
                            strokeWeight: 3
                        },
                        suppressMarkers: true,
                        map: map
                    });
                    
                    var pontos = data.rotas[i].pontos;
                    var start = {lat: pontos[i].lat, lng: pontos[i].log};
                    // Preparar los waypoints a partir de los puntos de la ruta
                    var waypts = pontos.slice(1, -1).map(function(ponto) {
                        return {
                            location: {lat: ponto.lat, lng: ponto.log},
                            stopover: true
                        };
                    });
                    
                    // Crear la solicitud para el servicio Directions
                    var request = {
                        origin: start,
                        destination: start,
                        waypoints: waypts,
                        optimizeWaypoints: true,
                        travelMode: 'DRIVING' // Modo de viaje
                    };
                    
                    
                    // Calcular la ruta
                    directionsService.route(request, function(result, status) {
                        if (status == 'OK') {
                            directionsRenderer.setDirections(result);   
                            
                            // Para cada waypoint colocar un marcador pequeño
                            // Extrae la ruta
                            var route = result.routes[0];                            
                            
                            // Itera a través de cada leg de la ruta
                            route.legs.forEach(function(leg) {                                
                                new google.maps.Marker({
                                    position: leg.start_location,
                                    map: map,
                                    icon: {
                                        path: google.maps.SymbolPath.CIRCLE,
                                        scale: 3, // Tamaño del marcador
                                        strokeColor: '#333FFF', // Color del borde neón 
                                        fillColor: '#FE020E', // Color de relleno neón '#2E9CCC'
                                        fillOpacity: 0.7, // Opacidad del relleno
                                        strokeWeight: 1.3 // Grosor del borde
                                    }
                                });                                  
                                //cTot+=1;
                            });                                 
                                                   
                        }
                    });
                    
                    if(i==rotas.length-1){
                        // Retrasar centrado y zoom del mapa
                        setTimeout(function() {
                            //document.getElementById('divGraficas').style.display = 'block';
                            //initGraf();
                            // Establecer el centro y el zoom
                            //map.setCenter(new google.maps.LatLng(-22.5646, -47.3817));
                            map.setCenter(new google.maps.LatLng(pontos[0].lat, pontos[0].log + 0.027)); 
                            map.setZoom(13.7);
                            
                            // Crear el marcador para el depósito
                            var puntoDeposito = {lat: pontos[0].lat, lng: pontos[0].log}; //{lat: -22.582608115451517, lng: -47.403629200148984};
                            var marcadorDeposito = new google.maps.Marker({
                                position: puntoDeposito,
                                map: map,
                                label: "D",
                                title: "Depósito"
                            });
                            
                            
                        }, 4500); // Retraso de 3500 ms
                        setTimeout(function() {
                            document.getElementById('divGraficas').style.display = 'block';
                            initGraf();   
                            const selector = document.getElementById('selectorDeArchivos');
                            selector.value = 'n_30_cvrp_out.json';   
                            console.log(vectorColores);                  
                        }, 2500);
                    }              
                    
                    // Actualizar arreglos
                    labelsR.push('Rota ' + (i+1));
                    //Por ahora esta cuenta rápida. Después se mejora la distribución y visualización
                    datosAjusT.push(rotas[i].tempo/tTot*rotas.length/2); // Normalizar o ajustar valores antes de añadirlo
                    datosAjusV.push(rotas[i].volume/vTot*rotas.length/2); // Normalizar o ajustar valores antes de añadirlo
                    datosAjusE.push(rotas[i].entregas/eTot*rotas.length/2); // Normalizar o ajustar valores antes de añadirlo
                    datos.get('Tempo').push(rotas[i].tempo); 
                    datos.get('Volume').push(rotas[i].volume);
                    datos.get('Entregas').push(rotas[i].entregas);
                    

                    
                    // Imprime el volumen de cada ruta
                    //console.log('Ruta ' + (i+1) + ': Volume = ' + rotas[i].volume);                
                    //console.log(i); // Imprime la respuesta JSON completa en la consola 
                                   
                }
                  
                
              })
              .catch(error => console.error('Error al cargar las rutas:', error));
            
            
            
            
            
                         
                                            
    });
    
    
}

function generarColor() {
    // Generar un color aleatorio en formato hexadecimal
    let color = "#" + Math.floor(Math.random()*16777215).toString(16);
    return color;
}

function generarColor2() {
    const hue = Math.floor(Math.random() * 360); // Valor entre 0 y 360
    const saturation = 80 + Math.floor(Math.random() * 20); // 80% a 100%
    const lightness = 40 + Math.floor(Math.random() * 20); // 40% a 60%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
    
function initGraf() {  
    
    const ctx = document.getElementById('GraficoDeLinea').getContext('2d');
    
    
    window.GraficoDeLinea = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelsR, // Eje X
            datasets: [{
                label: 'Tempo',
                //data: [12, 19, 3, 5, 2, 3, 9], // Datos de la Serie 1
                data: datosAjusT, // Datos de la Serie 1
                borderColor: 'rgb(20, 200, 30)',   //'rgb(255, 99, 132)',
                backgroundColor: 'rgba(20, 200, 30, 0.2)',  //'rgba(255, 99, 132, 0.2)',
                fill: true, // Rellenar el área bajo la línea
                pointRadius: 5, // Tamaño de los marcadores de puntos
                pointHoverRadius: 8, // Tamaño al pasar el mouse sobre los puntos
            }, {
                label: 'Volume',
                //data: [7, 11, 5, 8, 3, 7, 6], // Datos de la Serie 2
                data: datosAjusV,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 8,
            }, {
                label: 'Entregas',
                //data: [4, 14, 11, 2, 5, 4, 10], // Datos de la Serie 3
                data: datosAjusE,
                borderColor: 'rgb(255, 206, 86)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 8,
            },
            {
                label: 'M\u00E1x', // Nombre que aparecerá en la leyenda
                //data: [15, 15, 15, 15, 15, 15, 15], // Datos para la línea punteada
                data: max,
                borderColor: '#F05006', // Color de la línea punteada
                backgroundColor: 'transparent', // Fondo transparente para que no se rellene bajo la línea
                borderWidth: 2, // Ancho de la línea
                borderDash: [5, 5], // Patrón de la línea punteada
                pointRadius: 0, // Radio del punto (0 para que no se muestren puntos)
                fill: false, // Especifica que no se rellene el área bajo la línea
                tension: 0, // Líneas rectas sin curvatura
            },
            {
                label: 'M\u00EDn', // Nombre que aparecerá en la leyenda
                //data: [5, 5, 5, 5, 5, 5, 5], // Datos para la línea punteada (usualmente el mismo valor si es un límite horizontal)
                data: min,
                borderColor: '#C0C0C7', // Color de la línea punteada
                backgroundColor: 'transparent', // Fondo transparente para que no se rellene bajo la línea
                borderWidth: 2, // Ancho de la línea
                borderDash: [5, 5], // Patrón de la línea punteada
                pointRadius: 0, // Radio del punto (0 para que no se muestren puntos)
                fill: false, // Especifica que no se rellene el área bajo la línea
                tension: 0, // Líneas rectas sin curvatura
            }]
        },
        options: {            
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { // Definiendo el eje Y
                    beginAtZero: true
                }
            },
            interaction: {
                mode: 'nearest',
                intersect: true,
                axis: 'x'
            },            
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true, // Usar el estilo del punto para la leyenda
                        pointStyle: 'rectRounded', // Estilo del punto (cuadrado redondeado)
                        padding: 20, // Espaciado entre elementos de la leyenda
                        boxWidth: 8, // Ancho del cuadro de color en la leyenda
                        boxHeight: 8, // Altura del cuadro de color en la leyenda (opcional, para mantener proporción, podría omitirse)
                        color: 'rgba(255, 255, 255, 0.9)',
                        // Personaliza las etiquetas de la leyenda
                        generateLabels: function(chart) {
                            const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                            labels.forEach(label => {
                                // Cambiar marca cuadrada por línea en leyenda de convensiones
                                if (label.text === 'M\u00E1x' || label.text === 'M\u00EDn') {
                                    // Cambiar el estilo de punto a 'line'
                                    label.pointStyle = 'line';
                                    // Establecer el grosor de la línea para la leyenda
                                    label.lineWidth = 2;
                                    // Establecer el patrón de la línea punteada
                                    label.borderDash = [5, 5];
                                }
                            });
                            return labels;
                        },
                    }
                },
                title: {
                    display: true,
                    text: 'Equil\u00EDbrio e limites',
                    color: 'rgba(255, 255, 255, 0.9)',
                    padding: {
                        top: 10, // Aumentar la distancia del título desde la parte superior
                        bottom: 5 //Ajustar la distancia desde la parte inferior si es necesario
                    },
                    font: { // Agregar la configuración de la fuente
                        size: 18 // Tamaño de la fuente del título
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function(context) { 
                            // Obtener el nombre de la serie de datos
                            const label = context.dataset.label || '';
                            // Obtener índice de dato
                            const index = context.dataIndex;
                            // Acceder a los valores del label específico
                            const valores = datos.get(label);
                            // Obtener el valor real del punto de datos
                            const value = valores[index];
                            // Combinar la etiqueta y el valor para mostrar ambos en el tooltip
                            return `${label}: ${value}`;  //Adicionar código para entregar el valor real al tooltip
                        }
                    }
                }               
            },
            scales: {
                x: {
                    ticks: {
                      color: function(context) {
                        // `context` es un objeto que contiene información sobre el tick actual, incluyendo su índice
                        // Aquí puedes acceder a tu vector de colores usando `context.index` para cambiar el color de cada tick
                        return vectorColores[context.index];
                      },
                      // Otras opciones de configuración de los ticks
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)', // Color de las líneas de la cuadrícula del eje X
                    }
                },
                y: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.9)', // Color del texto de los ticks del eje Y
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)', // Color de las líneas de la cuadrícula del eje Y
                    },
                    min: 0, // Límite inferior en 0
                    max: 1, // Límite superior en 1
                }
            }             
        }
    });

     
    
    
    const ctxD = document.getElementById('GraficoDona').getContext('2d');
    window.GraficoTorta = new Chart(ctxD, {
        type: 'doughnut',
        data: {
            labels: ['Atendido', 'N\u00E3o atendido'],
            datasets: [{
                label: 'Porcentaje',
                data: [atendimiento, 100.0-atendimiento], // Estos valores deberían ser dinámicos
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            cutout: '67%',
            layout: {
                padding: {
                    left: 0, // Establecer según sea necesario
                    right: 0, // Establecer según sea necesario
                    // Mantén el top y bottom si es necesario
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true, // Usar el estilo del punto para la leyenda
                        pointStyle: 'rectRounded', // Estilo del punto (cuadrado redondeado)
                        padding: 25, // Espaciado entre elementos de la leyenda
                        boxWidth: 8, // Ancho del cuadro de color en la leyenda
                        boxHeight: 8, // Altura del cuadro de color en la leyenda (opcional, para mantener proporción, podría omitirse)
                        color: 'rgba(255, 255, 255, 0.9)',
                    },
                    align: 'center', // Alinear la leyenda al inicio (izquierda para 'bottom')
                    
                },
                title: {
                    display: true,
                    text: 'Qualidade de atendimento',
                    color: 'rgba(255, 255, 255, 0.9)',
                    padding: {
                        top: 10, // Aumentar la distancia del título desde la parte superior
                        bottom: 20, // Ajustar la distancia desde la parte inferior si es necesario
                        raight: 10,
                        left: 0,
                    },
                    font: { // Agregas la configuración de la fuente
                        size: 18 // Tamaño de la fuente del título
                    },
                },
                centerText: { // Plugin personalizado para agregar texto de espera
                    text: 'Calculando...' // Texto inicial, se actualizará con el porcentaje
                },
                layout: {
                    padding: {
                        top: 5, // Ajustar según sea necesario para el espacio adicional alrededor del gráfico
                    }
                } 
            }          
        },
        plugins: [{ // Agregar el plugin directamente al gráfico
            id: 'centerText', // Identificador para el plugin
            afterDraw: function(chart) { // Función que se llama después de que el gráfico se dibuja
                let text = chart.options.plugins.centerText.text,
                    ctx = chart.ctx,
                    centerX = (chart.chartArea.left + chart.chartArea.right) / 2,
                    centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
                ctx.save();
                ctx.font = '30px Arial';
                ctx.fillStyle = '#FFF'; // Cambia el color a blanco
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, centerX, centerY);
                ctx.restore();
            }
        }]
        
    });
    
    // Calculamor el porcentaje y actualizar el texto del plugin
    const total = GraficoTorta.data.datasets[0].data.reduce((a, b) => a + b, 0);
    const percentageText = ((GraficoTorta.data.datasets[0].data[0] / total) * 100).toFixed(1) + '%';
    
    // Actualizar el texto del plugin y forzar una actualización del gráfico
    GraficoTorta.options.plugins.centerText.text = percentageText;
    GraficoTorta.update();   
    
        
    const baseUrl = window.location.pathname;
    var jsonFilePathStats = `${baseUrl}static/json/${rotaStats}`.replace('//', '/');  
    //console.log(jsonFilePathStats);  
    fetch(jsonFilePathStats)
      .then(response => response.json()) // Convierte la respuesta en JSON
      .then(data => {    
          document.getElementById('Ff').textContent = data.final_fitness.toString().substring(0, 8);
          document.getElementById('Ge').textContent = data.final_generation.toString().substring(0, 8);
          document.getElementById('t').textContent = data.seconds_processed.toString().substring(0, 8);
          document.getElementById('Conv').textContent = cTot;
          //document.getElementById('Pop').textContent = data.population_size;
          document.getElementById('Rm').textContent = data.mutation_rate;
      })
      .catch(error => console.error('Error al cargar estadística:', error));
            
}

/*
//Para buscar .json y actualizar en servidor
document.getElementById('input-json').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function() {
        //Para obtener el nombre del archivo
        rotaStats = e.target.files[0].name.replace("_out", "_stats");        
        const data = JSON.parse(reader.result); // Parse the JSON file content
        // Aquí puedes llamar a la función que transforma el JSON
        const datosTransformados = transformarDatos(data); // Asumiendo que esta función ya existe
        // Prepara y realiza la actualización en GitHub
        actualizarArchivoGitHub(datosTransformados);
    };
    reader.readAsText(e.target.files[0]);
});
*/



function transformarDatos(datos) {
    try {
        // Transformar la estructura
        const nuevaEstructura = {
            atendimento: 97.3, // Valor estático, ajusta según necesidad
            rotas: datos.routes.map(route => {
                // Calcular el volumen total para la ruta
                const volumenTotal = route.orders.reduce((total, order) => total + order.volume, 0)-1;

                return {
                    id: route.id + 1, // Asume que quieres incrementar el id en 1
                    pontos: route.orders.flatMap(order => [
                        // Transforma cada dirección en un objeto de punto
                        { lat: order.address.latitude, log: order.address.longitude }
                    ]),
                    volume: volumenTotal, // Suma de todos los volúmenes de los pedidos de la ruta
                    tempo: Math.round(Math.random() * 2) + 5, // Valor estático, ajusta según necesidad
                    entregas: route.orders.length - 2 // Cantidad de entregas basada en el número de órdenes
                };
            })
        };

        return nuevaEstructura;
    } catch (error) {
        console.error("Error al transformar el JSON:", error);
    }
}




function actualizarArchivoGitHub(datosTransformados) {
    /*
    // Este es un ejemplo de cómo se podría hacer, pero recuerda no exponer tu PAT
    const url = `https://api.github.com/repos/CAMUZQUI/Correios-dashboard/contents/static/json/rotas.json`;
    const token = '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'; // ¡Alerta de seguridad!

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const sha = data.sha; // Necesitas el SHA actual del archivo para poder actualizarlo
        //const contentEncoded = btoa(unescape(encodeURIComponent(JSON.stringify(datosTransformados)))); // Codifica el nuevo contenido en base64
        const contentEncoded = btoa(unescape(encodeURIComponent(JSON.stringify(datosTransformados, null, 2)))); // El '2' añade la indentación

        
        fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: 'Actualiza el archivo rotas.json',
                content: contentEncoded,
                sha: sha
            })
        })
        .then(response => response.json())
        */
        
        document.getElementById('divGraficas').style.display = 'none';
        window.GraficoDeLinea.destroy(); // Destruye el gráfico existente
        window.GraficoTorta.destroy(); // Destruye el gráfico existente
        actMap(datosTransformados);
        //showAlert();
        
        
    //})
    //.catch(error => console.error('Error al obtener el archivo:', error));
}





function llenarSelectorConArchivos() {
  const owner = 'CAMUZQUI'; // Tu nombre de usuario en GitHub
  const repo = 'Correios-dashboard'; // El nombre de tu repositorio
  const path = 'static/json'; // La ruta a la carpeta dentro de tu repositorio

  fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`)
    .then(response => response.json())
    .then(data => {
      const selector = document.getElementById('selectorDeArchivos');
      // Limpiar las opciones existentes
      selector.innerHTML = '';

      // Filtrar y añadir solo los archivos deseados como opciones
      data.forEach(archivo => {
        if (archivo.name.endsWith('_out.json')) {
          const opcion = document.createElement('option');
          opcion.value = archivo.download_url; // Usar la URL de descarga como valor
          opcion.textContent = archivo.name;
          selector.appendChild(opcion);
        }
      });      
    })
    .catch(error => console.error('Error al obtener archivos:', error)); 
  
}

document.addEventListener('DOMContentLoaded', llenarSelectorConArchivos);

document.getElementById('selectorDeArchivos').addEventListener('change', function() {
    const baseUrl = window.location.pathname;
    const selectedFileName = this.value; // Obtén el nombre del archivo seleccionado
    const filePath = `${selectedFileName}`; // Construye la ruta al archivo
    
    //console.log(filePath);
    
    fetch(filePath)
        .then(response => response.json()) // Parsea la respuesta como JSON
        .then(data => {
            const  pathParts = filePath.split('/');
            const fileName = pathParts.pop();
            // Obtener el nombre para el archivo estadísticas reemplazando "_out" con "_stats"
            rotaStats = fileName.replace("_cvrp_out", "_ga_stats");
    
            // Aquí puedes llamar a la función que transforma el JSON
            const datosTransformados = transformarDatos(data); // Asumiendo que esta función ya existe
    
            // Prepara y realiza la actualización en GitHub
            actualizarArchivoGitHub(datosTransformados);
            console.log(datosTransformados);
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
});






//Para eliminar cookies
document.addEventListener('DOMContentLoaded', (event) => {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  }
  llenarSelectorConArchivos;
});
