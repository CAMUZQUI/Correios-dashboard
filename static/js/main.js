function initMap() {

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

            jsonFilePath = `${baseUrl}static/json/rotas.json`.replace('//', '/');
            
            fetch(jsonFilePath)
              .then(response => response.json()) // Convierte la respuesta en JSON
              .then(data => {
                  
                var rotas = data.rotas;
                                
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
                            
                            // Para cada waypoint colocar un marcador pequeño
                            // Extrae la ruta
                            var route = result.routes[0];
                    
                            
                    
                            // Itera a través de cada leg de la ruta
                            route.legs.forEach(function(leg) {
                                // Coloca un marcador en cada paso (punto de giro) de la leg
                                leg.steps.forEach(function(step) {
                                    new google.maps.Marker({
                                        position: step.start_location,
                                        map: map,
                                        icon: {
                                            path: google.maps.SymbolPath.CIRCLE,
                                            scale: 3, // Tamaño del marcador
                                            strokeColor: '#333FFF', // Color del borde neón
                                            fillColor: '#2E9CCC', // Color de relleno neón
                                            fillOpacity: 0.3, // Opacidad del relleno
                                            strokeWeight: 0.9 // Grosor del borde
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
                            map.setCenter(new google.maps.LatLng(-22.5646, -47.3817)); 
                            map.setZoom(13.7);
                            
                            // Crear el marcador para el depósito
                            var puntoDeposito = {lat: -22.582608115451517, lng: -47.403629200148984};
                            var marcadorDeposito = new google.maps.Marker({
                                position: puntoDeposito,
                                map: map,
                                label: "D",
                                title: "Depósito"
                            });
                            
                            
                        }, 3500); // Retraso de 3500 ms
                        setTimeout(function() {
                            document.getElementById('divGraficas').style.display = 'block';
                            initGraf();                        
                        }, 1500);
                    }
                    
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
    const GraficoDeLinea = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Rota 1', 'Rota 2', 'Rota 3', 'Rota 4', 'Rota 5', 'Rota 6', 'Rota 7'], // Eje X
            datasets: [{
                label: 'Tempo',
                //data: [12, 19, 3, 5, 2, 3, 9], // Datos de la Serie 1
                data: [12/20, 19/20, 3/20, 5/20, 2/20, 3/20, 9/20], // Datos de la Serie 1
                borderColor: 'rgb(20, 200, 30)',   //'rgb(255, 99, 132)',
                backgroundColor: 'rgba(20, 200, 30, 0.2)',  //'rgba(255, 99, 132, 0.2)',
                fill: true, // Rellenar el área bajo la línea
                pointRadius: 5, // Tamaño de los marcadores de puntos
                pointHoverRadius: 8, // Tamaño al pasar el mouse sobre los puntos
            }, {
                label: 'Capacidade',
                //data: [7, 11, 5, 8, 3, 7, 6], // Datos de la Serie 2
                data: [7/20, 11/20, 5/20, 8/20, 3/20, 7/20, 6/20],
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 8,
            }, {
                label: 'Entregas',
                //data: [4, 14, 11, 2, 5, 4, 10], // Datos de la Serie 3
                data: [4/20, 14/20, 11/20, 2/20, 5/20, 4/20, 10/20],
                borderColor: 'rgb(255, 206, 86)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 8,
            },
            {
                label: 'M\u00E1x', // Nombre que aparecerá en la leyenda
                //data: [15, 15, 15, 15, 15, 15, 15], // Datos para la línea punteada
                data: [0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75],
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
                data: [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25],
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
                            // Obtener el valor real del punto de datos
                            const value = context.raw * 20;
                            // Combinar la etiqueta y el valor para mostrar ambos en el tooltip
                            return `${label}: ${value}`;  //Adicionar código para entregar el valor real al tooltip
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
    const GraficoTorta = new Chart(ctxD, {
        type: 'doughnut',
        data: {
            labels: ['Atendido', 'N\u00E3o atendido'],
            datasets: [{
                label: 'Porcentaje',
                data: [97, 3], // Estos valores deberían ser dinámicos
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
            
}


document.getElementById('input-csv').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function() {
        const lines = reader.result.split('\n').map(function(line){
            return line.split(',');
        });
        console.log(lines); // CSV convertido en un array de JavaScript
    };
    reader.readAsText(e.target.files[0]);
});
