var map;
var geocoder;
var autocomplete;
var markerInicio;
var markers = [];
var markersDestino = [];
var latLon;

$(document).ready(function() {
	$("#solicitarEntrega").click(validate);
	$("#btn-calcular-tiempo").click(mostrartiempo);

});
function validate(){
	if($("#txtContacto--Origen").val().length < 2){
		$("txtContacto--Origen").focus();
		alert("Ingrese nombres de contacto por favor");
		return false;
	}
	if($("#txtTelefono--Origen").val().length <9){
		$("#txtTelefono--Origen").focus();
		alert("El telefono debe contener 9 dígitos");
		return false;
	}
	if($("#originAddress").val().length == ""){
		$("#originAddress").focus();
			alert("Complete la dirección de origen por favor");
		return false;
	}
	if($("#interior").val().length > 1){
		$("#interior").focus();
			alert("El número de interior debe contener al menos 1 dígito");
		return false;
	}
	var formatoEmail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (!formatoEmail.test($("#email").val())) {
    	$("#email").focus();
        alert('El correo electrónico introducido no es correcto.');
        return false;
    }
}

function initAutocomplete() {
	// Validar si el navegador tiene geolocalización
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(cargarMapa, errores);
    } else {
        alert('Oops! Tu navegador no soporta geolocalización.');
    }

	var properties = {
		types: ['geocode'],
  		componentRestrictions: {country: 'pe'}
	};

	// Creamos el objeto autocomplete para input Inicio, restringuido la busqueda por pais {country: 'pe'}
	autocomplete = new google.maps.places.Autocomplete(document.getElementById('originAddress'), properties);
	autocomplete.addListener('place_changed', function setDirection() {
    	agregarDireccionInicio($("#originAddress").val());
		mostrarDireccionInicio($("#originAddress").val());
	});

	// Creamos el objeto autocomplete para input Destino
	autocomplete = new google.maps.places.Autocomplete(document.getElementById('destinoAddress'), properties);
	autocomplete.addListener('place_changed', function setDirection() {
		mostrarDireccionDestino($("#destinoAddress").val());
	});
};

function cargarMapa(position) {
	var lat = position.coords.latitude; // Guardamos nuestra latitud
    var lon = position.coords.longitude; // Guardamos nuestra longitud
    var latlon = new google.maps.LatLng(lat, lon); // Creamos un punto con nuestras coordenadas
 	$("#mapa").addClass("classMap");

    var propiedadMapa = {
	    center: latlon, // Definimos la posicion del mapa con el punto
	    zoom: 16,
	    mapTypeId: google.maps.MapTypeId.ROADMAP,
	    mapTypeControl: false,
	   	disableDefaultUI: true,
	   	streetViewControl: false,
	   	zoomControl: false
    };
    // Creamos el mapa y lo situamos en su capa
    map = new google.maps.Map(document.getElementById('mapa'), propiedadMapa);
    // Creamos el objeto principal para realizar la petición de consulta a Google Maps
    geocoder = new google.maps.Geocoder();
    // Marcamos nuestra ubicación
	miUbicacion();

 };

function miUbicacion() {
	var latlon = map.getCenter(); // Obtener la posición del mapa
    var propiedadMarker = {
    	map: map, // Vinculamos al mapa
    	position: latlon, // Nos situamos en nuestro punto
    	draggable: true, // Nos permite poder mover el marcador
    	icon: 'img/marker.png'
    };

    // Creamos un marcador en el mapa
    markerInicio = new google.maps.Marker(propiedadMarker);
    // Cada vez que insertemos un marcador, la insertamos en el array mediante el método .push()
    markers.push(markerInicio);
    // Agregamos la dirección en el input (Punto de Partida)
	agregarDireccionInicio();
	// Agregamos la function a ejecutar al evento de mover el marcador
    google.maps.event.addListener(markerInicio, 'position_changed', agregarDireccionInicio);
};

function agregarDireccionInicio() {
	var propertieGeocoder = {
    	latLng: markerInicio.getPosition(),
    	region: "PE"
    };
    geocoder.geocode(propertieGeocoder, function processGeocoder(results, status) {
    	if (status == google.maps.GeocoderStatus.OK) {
    		if (results[0]) {
    			var direction = results[0]['formatted_address'];
    			$("#originAddress").val(direction);
    			   		}
    	} else {
			//alert("Error: " + status);
		}
    });
};

function errores(err) {
	if (err.code == 0) {
		alert("Oops! Algo ha salido mal");
	}
	if (err.code == 1) {
		alert("Oops! No has aceptado compartir tu posición");
	}
	if (err.code == 2) {
		alert("Oops! No se puede obtener la posición actual");
	}
	if (err.code == 3) {
		alert("Oops! Hemos superado el tiempo de espera");
	}
};

function geolocate() {
  	if (navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(function(position) {
			var geolocation = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			var circle = new google.maps.Circle({
				center: geolocation,
				radius: position.coords.accuracy
			});
			autocomplete.setBounds(circle.getBounds());
	    });
	}
};

function mostrarDireccionInicio(direction) {
	geocoder.geocode({ "address": direction} , function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
	    	// Eliminamos los marcadores del mapa
	    	eliminarMarkers(markers);
			// Creamos un marcador en el mapa
	        var marker = new google.maps.Marker({
	        	map: map,
		    	position: results[0].geometry.location,
		    	icon: 'img/marker.png'
	    	});
	    	map.setCenter(marker.getPosition()); // Definimos la posicion del mapa con el punto
		} else {
			alert("Error: " + status);
		}
	});
};

function mostrarDireccionDestino(direction) {
	geocoder.geocode({ "address": direction} , function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			// Eliminamos los marcadores "destino" del mapa
	    	eliminarMarkers(markersDestino);
			// Creamos un marcador en el mapa
	        var marker = new google.maps.Marker({
	        	map: map,
		    	position: results[0].geometry.location,
		    	icon: 'img/markerEnd.png'
	    	});
	    	mostrarRuta(marker.getPosition());
		    // Cada vez que insertemos un marcador, la insertamos en el array mediante el método .push()
		    markersDestino.push(marker);	    	
		} else {
			alert("Error: " + status);
		}
	});
};

function mostrarRuta(position) {
	latlon = map.getCenter();
	latlonDestino = new google.maps.LatLng(position.lat(), position.lng());

	var propiedadRuta = {
		origin: latlon, // Origen
		destination: latlonDestino, // Destino
		travelMode: google.maps.TravelMode.DRIVING // Indicaciones para llegar en auto (WALKING = pie)
	}
	var propiedadDisplay = {
		map: map,
		suppressMarkers: true
	} 
	//var distanciaP = google.maps.geometry.spherical.computeDistanceBetween(latlon, latlonDestino);

	var dirService = new google.maps.DirectionsService();
	var dirDisplay = new google.maps.DirectionsRenderer(propiedadDisplay);

	// Calcular ruta entre 2 ubicaciones
	dirService.route(propiedadRuta, function getResponse(results, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			dirDisplay.setDirections(results);
		} else {
			alert("Error: " + status);
		}
	});
};

function eliminarMarkers(listMarker) {
	for (var p in listMarker) {
		listMarker[p].setMap(null);
	}
};

function mostrartiempo(){
   var origenAdress = $("#originAddress").val();
   var destinoAdress = $("#destinoAddress").val();
   //calcular la distancia recorrida y la duración orígenes y destinos 
   var service = new google.maps.DistanceMatrixService();
   service.getDistanceMatrix({
     origins: [origenAdress],
     destinations: [destinoAdress],
     travelMode: google.maps.TravelMode.DRIVING,
     unitSystem: google.maps.UnitSystem.METRIC
   },callback);
};
 
function callback(respuesta, status) {
   if (status != google.maps.DistanceMatrixStatus.OK) {
      alert('Error: ' + status);
   } else {
	    var origen = respuesta.originAddresses;
	    var destino = respuesta.destinationAddresses;
	    var distance = document.getElementById("distance");
	        distance.innerHTML = '';
	    var duracion = document.getElementById("time");
	        duracion.innerHTML = '';

      for (var i = 0; i < origen.length; i++) {
         var results = respuesta.rows[i].elements;
         for (var j = 0; j < results.length; j++) {
            distance.innerHTML = results[j].distance.text;
            duracion.innerHTML += results[j].duration.text;
         }
      }
   }
}



