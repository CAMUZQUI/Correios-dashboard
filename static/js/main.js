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

var rotaStats = "";

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
                    position: google.maps.ControlPosition.LEFT_BOTTOM // Posici�n del control de zoom
                },
                fullscreenControl: true,
                fullscreenControlOptions: {
                    position: google.maps.ControlPosition.LEFT_TOP // Posici�n del control de zoom
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
              
                console.log(data);
                  
                atendimiento = data.atendimento;
                var rotas = data.rotas;
                
                // Para valores totales de cada ruta (sumatorias)
                for (var i = 0; i < rotas.length; i++) {
                    tTot+=rotas[i].tempo;
                    vTot+=rotas[i].volume;
                    eTot+=rotas[i].entregas;
                    max.push(0.75);
                    min.push(0.25);
                }
                
                datos.set('Tempo', []);
                datos.set('Volume', []);
                datos.set('Entregas', []);
                                                
                // Iterar sobre todas las rutas
                for (var i = 0; i < rotas.length; i++) {
                
                    // Servicio Directions para procesar 'request'
                    var directionsService = new google.maps.DirectionsService();                               
                    let directionsRenderer = new google.maps.DirectionsRenderer({
                        polylineOptions: {
                            strokeColor: generarColor2(), // Puedes poner cualquier color en formato hexadecimal   
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
                            
                            // Para cada waypoint colocar un marcador peque�o
                            // Extrae la ruta
                            var route = result.routes[0];                   
                            
                    
                            // Itera a trav�s de cada leg de la ruta
                            route.legs.forEach(function(leg) {
                                // Coloca un marcador en cada paso (punto de giro) de la leg
                                leg.steps.forEach(function(step) {
                                    new google.maps.Marker({
                                        position: step.start_location,
                                        map: map,
                                        icon: {
                                            path: google.maps.SymbolPath.CIRCLE,
                                            scale: 3, // Tama�o del marcador
                                            strokeColor: '#333FFF', // Color del borde ne�n 
                                            fillColor: '#FE020E', // Color de relleno ne�n '#2E9CCC'
                                            fillOpacity: 0.7, // Opacidad del relleno
                                            strokeWeight: 1.3 // Grosor del borde
                                        }
                                    });
                                });  
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
                            
                            // Crear el marcador para el dep�sito
                            var puntoDeposito = {lat: pontos[0].lat, lng: pontos[0].log}; //{lat: -22.582608115451517, lng: -47.403629200148984};
                            var marcadorDeposito = new google.maps.Marker({
                                position: puntoDeposito,
                                map: map,
                                label: "D",
                                title: "Dep�sito"
                            });
                            
                            
                        }, 4500); // Retraso de 3500 ms
                        setTimeout(function() {
                            document.getElementById('divGraficas').style.display = 'block';
                            initGraf();                        
                        }, 2500);
                    }              
                    
                    // Actualizar arreglos
                    labelsR.push('Rota ' + (i+1));
                    //Por ahora esta cuenta r�pida. Despu�s se mejora la distribuci�n y visualizaci�n
                    datosAjusT.push(rotas[i].tempo/tTot*rotas.length/2); // Normalizar o ajustar valores antes de a�adirlo
                    datosAjusV.push(rotas[i].volume/vTot*rotas.length/2); // Normalizar o ajustar valores antes de a�adirlo
                    datosAjusE.push(rotas[i].entregas/eTot*rotas.length/2); // Normalizar o ajustar valores antes de a�adirlo
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
                fill: true, // Rellenar el �rea bajo la l�nea
                pointRadius: 5, // Tama�o de los marcadores de puntos
                pointHoverRadius: 8, // Tama�o al pasar el mouse sobre los puntos
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
                label: 'M\u00E1x', // Nombre que aparecer� en la leyenda
                //data: [15, 15, 15, 15, 15, 15, 15], // Datos para la l�nea punteada
                data: max,
                borderColor: '#F05006', // Color de la l�nea punteada
                backgroundColor: 'transparent', // Fondo transparente para que no se rellene bajo la l�nea
                borderWidth: 2, // Ancho de la l�nea
                borderDash: [5, 5], // Patr�n de la l�nea punteada
                pointRadius: 0, // Radio del punto (0 para que no se muestren puntos)
                fill: false, // Especifica que no se rellene el �rea bajo la l�nea
                tension: 0, // L�neas rectas sin curvatura
            },
            {
                label: 'M\u00EDn', // Nombre que aparecer� en la leyenda
                //data: [5, 5, 5, 5, 5, 5, 5], // Datos para la l�nea punteada (usualmente el mismo valor si es un l�mite horizontal)
                data: min,
                borderColor: '#C0C0C7', // Color de la l�nea punteada
                backgroundColor: 'transparent', // Fondo transparente para que no se rellene bajo la l�nea
                borderWidth: 2, // Ancho de la l�nea
                borderDash: [5, 5], // Patr�n de la l�nea punteada
                pointRadius: 0, // Radio del punto (0 para que no se muestren puntos)
                fill: false, // Especifica que no se rellene el �rea bajo la l�nea
                tension: 0, // L�neas rectas sin curvatura
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
                        boxHeight: 8, // Altura del cuadro de color en la leyenda (opcional, para mantener proporci�n, podr�a omitirse)
                        color: 'rgba(255, 255, 255, 0.9)',
                        // Personaliza las etiquetas de la leyenda
                        generateLabels: function(chart) {
                            const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                            labels.forEach(label => {
                                // Cambiar marca cuadrada por l�nea en leyenda de convensiones
                                if (label.text === 'M\u00E1x' || label.text === 'M\u00EDn') {
                                    // Cambiar el estilo de punto a 'line'
                                    label.pointStyle = 'line';
                                    // Establecer el grosor de la l�nea para la leyenda
                                    label.lineWidth = 2;
                                    // Establecer el patr�n de la l�nea punteada
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
                        top: 10, // Aumentar la distancia del t�tulo desde la parte superior
                        bottom: 5 //Ajustar la distancia desde la parte inferior si es necesario
                    },
                    font: { // Agregar la configuraci�n de la fuente
                        size: 18 // Tama�o de la fuente del t�tulo
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function(context) { 
                            // Obtener el nombre de la serie de datos
                            const label = context.dataset.label || '';
                            // Obtener �ndice de dato
                            const index = context.dataIndex;
                            // Acceder a los valores del label espec�fico
                            const valores = datos.get(label);
                            // Obtener el valor real del punto de datos
                            const value = valores[index];
                            // Combinar la etiqueta y el valor para mostrar ambos en el tooltip
                            return `${label}: ${value}`;  //Adicionar c�digo para entregar el valor real al tooltip
                        }
                    }
                }               
            },
            scales: {
                x: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.9)', // Color del texto de los ticks del eje X
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)', // Color de las l�neas de la cuadr�cula del eje X
                    }
                },
                y: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.9)', // Color del texto de los ticks del eje Y
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)', // Color de las l�neas de la cuadr�cula del eje Y
                    },
                    min: 0, // L�mite inferior en 0
                    max: 1, // L�mite superior en 1
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
                data: [atendimiento, 100.0-atendimiento], // Estos valores deber�an ser din�micos
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
                    left: 0, // Establecer seg�n sea necesario
                    right: 0, // Establecer seg�n sea necesario
                    // Mant�n el top y bottom si es necesario
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
                        boxHeight: 8, // Altura del cuadro de color en la leyenda (opcional, para mantener proporci�n, podr�a omitirse)
                        color: 'rgba(255, 255, 255, 0.9)',
                    },
                    align: 'center', // Alinear la leyenda al inicio (izquierda para 'bottom')
                    
                },
                title: {
                    display: true,
                    text: 'Qualidade de atendimento',
                    color: 'rgba(255, 255, 255, 0.9)',
                    padding: {
                        top: 10, // Aumentar la distancia del t�tulo desde la parte superior
                        bottom: 20, // Ajustar la distancia desde la parte inferior si es necesario
                        raight: 10,
                        left: 0,
                    },
                    font: { // Agregas la configuraci�n de la fuente
                        size: 18 // Tama�o de la fuente del t�tulo
                    },
                },
                centerText: { // Plugin personalizado para agregar texto de espera
                    text: 'Calculando...' // Texto inicial, se actualizar� con el porcentaje
                },
                layout: {
                    padding: {
                        top: 5, // Ajustar seg�n sea necesario para el espacio adicional alrededor del gr�fico
                    }
                } 
            }          
        },
        plugins: [{ // Agregar el plugin directamente al gr�fico
            id: 'centerText', // Identificador para el plugin
            afterDraw: function(chart) { // Funci�n que se llama despu�s de que el gr�fico se dibuja
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
    
    // Actualizar el texto del plugin y forzar una actualizaci�n del gr�fico
    GraficoTorta.options.plugins.centerText.text = percentageText;
    GraficoTorta.update();   
    
    const baseUrl = window.location.pathname;
    var jsonFilePathStats = `${baseUrl}static/json/rotas_stats.json`.replace('//', '/');    
    fetch(jsonFilePathStats)
      .then(response => response.json()) // Convierte la respuesta en JSON
      .then(data => {    
          document.getElementById('Ff').textContent = data.final_fitness.toString().substring(0, 8);
          document.getElementById('Ge').textContent = data.final_generation.toString().substring(0, 8);
          document.getElementById('t').textContent = data.seconds_processed.toString().substring(0, 8);
          if(data.converge) document.getElementById('Conv').textContent = "Converge"; else document.getElementById('Conv').textContent = "";
          document.getElementById('Pop').textContent = data.population_size;
          document.getElementById('Rm').textContent = data.mutation_rate;
      })
      .catch(error => console.error('Error al cargar estad�stica:', error));
            
}


//Para buscar .json y actualizar en servidor
document.getElementById('input-json').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function() {
        //Para obtener el nombre del archivo
        rotaStats = e.target.files[0].name.replace("_out", "_stats");        
        const data = JSON.parse(reader.result); // Parse the JSON file content
        // Aqu� puedes llamar a la funci�n que transforma el JSON
        const datosTransformados = transformarDatos(data); // Asumiendo que esta funci�n ya existe
        // Prepara y realiza la actualizaci�n en GitHub
        actualizarArchivoGitHub(datosTransformados);
    };
    reader.readAsText(e.target.files[0]);
});




function transformarDatos(datos) {
    try {
        // Transformar la estructura
        const nuevaEstructura = {
            atendimento: 97.3, // Valor est�tico, ajusta seg�n necesidad
            rotas: datos.routes.map(route => {
                // Calcular el volumen total para la ruta
                const volumenTotal = route.orders.reduce((total, order) => total + order.volume, 0);

                return {
                    id: route.id + 1, // Asume que quieres incrementar el id en 1
                    pontos: route.orders.flatMap(order => [
                        // Transforma cada direcci�n en un objeto de punto
                        { lat: order.address.latitude, log: order.address.longitude }
                    ]),
                    volume: volumenTotal, // Suma de todos los vol�menes de los pedidos de la ruta
                    tempo: 5, // Valor est�tico, ajusta seg�n necesidad
                    entregas: route.orders.length // Cantidad de entregas basada en el n�mero de �rdenes
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
    // Este es un ejemplo de c�mo se podr�a hacer, pero recuerda no exponer tu PAT
    const url = `https://api.github.com/repos/CAMUZQUI/Correios-dashboard/contents/static/json/rotas.json`;
    const token = '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'; // �Alerta de seguridad!

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
        const contentEncoded = btoa(unescape(encodeURIComponent(JSON.stringify(datosTransformados, null, 2)))); // El '2' a�ade la indentaci�n

        
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
        window.GraficoDeLinea.destroy(); // Destruye el gr�fico existente
        window.GraficoTorta.destroy(); // Destruye el gr�fico existente
        actMap(datosTransformados);
        //showAlert();
        
        
    //})
    //.catch(error => console.error('Error al obtener el archivo:', error));
}





//Para eliminar cookies
document.addEventListener('DOMContentLoaded', (event) => {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  }
});

