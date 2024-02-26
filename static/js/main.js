function initMap() {
        
    fetch('/static/json/map_styles.json')
        .then(function(response) {
            return response.json();
        })
        
        .then(function(styles) {

            var mapOptions = {
                center: new google.maps.LatLng(-22.5646, -47.4017),      
                zoom: 15,          
                styles: styles,                
                // Estas opciones ocultan la UI por defecto
                disableDefaultUI: true,
                // Aquí puedes personalizar qué controles quieres mostrar
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
            
            /*
            var marker = new google.maps.Marker({
                position: mapOptions.center,
                map: map,
                title: 'Limeira, Brasil'
            });
            */
            
            
            
            // Configura el servicio Directions y el renderer
            var directionsService = new google.maps.DirectionsService();
            //var directionsRenderer = new google.maps.DirectionsRenderer();            
            var directionsRenderer = new google.maps.DirectionsRenderer({
                polylineOptions: {
                    strokeColor: 'yellow', // Puedes poner cualquier color en formato hexadecimal   
                    strokeOpacity: 1.0,                 
                    strokeWeight: 3
                },
                map: map
            });            
            //directionsRenderer.setMap(map); // Usa el mismo mapa para el renderizador
            
            
            var directionsRenderer2 = new google.maps.DirectionsRenderer({
                polylineOptions: {
                    strokeColor: '#43D311', // Puedes poner cualquier color en formato hexadecimal   
                    strokeOpacity: 1.0,                 
                    strokeWeight: 3
                },
                map: map
            });  
            
            
            var start = { lat: -22.5646, lng: -47.4017 };
            var waypts = [
                {location: {lat: -22.5757, lng: -47.4128}, stopover: true},
                {location: {lat: -22.5568, lng: -47.3939}, stopover: true},
                // Agrega más waypoints si es necesario
            ];
            
            
            var waypts2 = [
                {location: {lat: -22.5457, lng: -47.4128}, stopover: true},
                {location: {lat: -22.5568, lng: -47.4239}, stopover: true},
                // Agrega más waypoints si es necesario
            ];
            
            /*var ruta = [
              //{ lat: -22.5646, lng: -47.4017 },
              { lat: -22.5557, lng: -47.4128 },
              { lat: -22.5368, lng: -47.3939 },
              { lat: -22.5468, lng: -47.4239 },
              { lat: -22.5568, lng: -47.3839 },
              //{ lat: -22.5646, lng: -47.4017 },
              // Agrega más puntos según sea necesario
            ];*/
        
            //for (var iRuta = 1; iRuta < ruta.length; iRuta++) {
        
                // Crea una solicitud para el servicio Directions
                var request = {
                    origin: start,
                    destination: start,  
                    waypoints: waypts,
                    optimizeWaypoints: true,                                  
                    travelMode: 'DRIVING' // Modo de viaje
                };
                
                var request2 = {
                    origin: start,
                    destination: start,  
                    waypoints: waypts2,
                    optimizeWaypoints: true,
                    travelMode: 'DRIVING'
                };
            
                // Calcula la ruta
                directionsService.route(request, function(result, status) {
                    if (status == 'OK') {
                        directionsRenderer.setDirections(result);                        
                                      
                        /*
                        //if(iRuta==ruta.length){
                            // Retrasa el ajuste manual del centro y zoom
                            setTimeout(function() {
                                //document.getElementById('divGraficas').style.display = 'block';
                                //initGraf();
                                // Establece el centro y el zoom específicos aquí
                                //map.panTo(new google.maps.LatLng(-22.5646, -47.4017));
                                map.setCenter(new google.maps.LatLng(-22.5646, -47.3817)); 
                                map.setZoom(13.7);
                                
                            }, 3500); // Retraso de 500 ms
                            setTimeout(function() {
                                document.getElementById('divGraficas').style.display = 'block';
                                initGraf();                        
                            }, 1500);
                        //} 
                        */   
                        
                        setTimeout(function() {
                            // Solicita la segunda ruta
                            directionsService.route(request2, function(result, status) {
                                if (status == 'OK') {
                                    directionsRenderer2.setDirections(result);
                                    // Retrasa el ajuste manual del centro y zoom
                                    setTimeout(function() {
                                        //document.getElementById('divGraficas').style.display = 'block';
                                        //initGraf();
                                        // Establece el centro y el zoom específicos aquí
                                        //map.panTo(new google.maps.LatLng(-22.5646, -47.4017));
                                        map.setCenter(new google.maps.LatLng(-22.5646, -47.3817)); 
                                        map.setZoom(13.7);
                                        
                                    }, 3500); // Retraso de 500 ms
                                    setTimeout(function() {
                                        document.getElementById('divGraficas').style.display = 'block';
                                        initGraf();                        
                                    }, 1500);
                                }
                            });                        
                        }, 1200);                
                        
                    }
                });
                
                
                
            //}
            
               
    });
    
    //initGraf();
    
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
                fill: true, // Rellena el área bajo la línea
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
                //data: [15, 15, 15, 15, 15, 15, 15], // Datos para la línea punteada (usualmente el mismo valor si es un límite horizontal)
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
                        usePointStyle: true, // Usa el estilo del punto para la leyenda
                        pointStyle: 'rectRounded', // Estilo del punto (cuadrado redondeado)
                        padding: 20, // Espaciado entre elementos de la leyenda
                        boxWidth: 8, // Ancho del cuadro de color en la leyenda
                        boxHeight: 8, // Altura del cuadro de color en la leyenda (opcional, para mantener proporción, podría omitirse)
                        color: 'rgba(255, 255, 255, 0.9)',
                        // Personaliza las etiquetas de la leyenda
                        generateLabels: function(chart) {
                            const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                            labels.forEach(label => {
                                // Verifica si la etiqueta corresponde a la serie que quieres cambiar
                                if (label.text === 'M\u00E1x' || label.text === 'M\u00EDn') {
                                    // Cambia el estilo de punto a 'line'
                                    label.pointStyle = 'line';
                                    // Establece el grosor de la línea para la leyenda
                                    label.lineWidth = 2;
                                    // Establece el patrón de la línea punteada
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
                        top: 10, // Aumenta la distancia del título desde la parte superior
                        bottom: 5 // Puedes ajustar la distancia desde la parte inferior si es necesario
                    },
                    font: { // Aquí agregas la configuración de la fuente
                        size: 18 // Tamaño de la fuente del título
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function(context) { 
                            // Obtén el nombre de la serie de datos
                            const label = context.dataset.label || '';
                            // Obtén el valor real del punto de datos
                            const value = context.raw * 20;
                            // Combina la etiqueta y el valor para mostrar ambos en el tooltip
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
                    min: 0, // Límite inferior fijado en 0
                    max: 1, // Límite superior fijado en 1
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
                        usePointStyle: true, // Usa el estilo del punto para la leyenda
                        pointStyle: 'rectRounded', // Estilo del punto (cuadrado redondeado)
                        padding: 25, // Espaciado entre elementos de la leyenda
                        boxWidth: 8, // Ancho del cuadro de color en la leyenda
                        boxHeight: 8, // Altura del cuadro de color en la leyenda (opcional, para mantener proporción, podría omitirse)
                        color: 'rgba(255, 255, 255, 0.9)',
                    },
                    align: 'center', // Esto alinea la leyenda al inicio (izquierda para 'bottom')
                    
                },
                title: {
                    display: true,
                    text: 'Qualidade de atendimento',
                    color: 'rgba(255, 255, 255, 0.9)',
                    padding: {
                        top: 10, // Aumenta la distancia del título desde la parte superior
                        bottom: 20, // Puedes ajustar la distancia desde la parte inferior si es necesario
                    },
                    font: { // Aquí agregas la configuración de la fuente
                        size: 18 // Tamaño de la fuente del título
                    },
                },
                centerText: { // Nuestro plugin personalizado para agregar texto
                    text: 'Calculando...' // Texto inicial, se actualizará con el porcentaje
                },
                layout: {
                    padding: {
                        top: 5, // Ajusta según sea necesario para el espacio adicional alrededor del gráfico
                    }
                } 
            }          
        },
        plugins: [{ // Agregamos el plugin directamente al gráfico
            id: 'centerText', // Un identificador único para el plugin
            afterDraw: function(chart) { // La función que se llama después de que el gráfico se dibuja
                let text = chart.options.plugins.centerText.text,
                    ctx = chart.ctx,
                    centerX = (chart.chartArea.left + chart.chartArea.right) / 2,
                    centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
                ctx.save();
                ctx.font = '30px Arial';
                ctx.fillStyle = '#FFF'; // Cambiamos el color a blanco
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, centerX, centerY);
                ctx.restore();
            }
        }]
        
    });
    
    // Ahora calculamos el porcentaje y actualizamos el texto del plugin
    const total = GraficoTorta.data.datasets[0].data.reduce((a, b) => a + b, 0);
    const percentageText = ((GraficoTorta.data.datasets[0].data[0] / total) * 100).toFixed(1) + '%';
    
    // Actualizamos el texto del plugin y forzamos una actualización del gráfico
    GraficoTorta.options.plugins.centerText.text = percentageText;
    GraficoTorta.update();       
            
}


document.getElementById('input-csv').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function() {
        const lines = reader.result.split('\n').map(function(line){
            return line.split(',');
        });
        console.log(lines); // Aquí tienes tu CSV convertido en un array de JavaScript
    };
    reader.readAsText(e.target.files[0]);
});
