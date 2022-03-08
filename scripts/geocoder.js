/**
*Function that open the layers menu
**/
function openGeocoderMenu(){
	// Si une autre page est ouverte
	if (window.OPENED_MENU != 'null'){
		hideMenu();
	}

	// We change is event on click
	document.getElementById('menus_button_geocoder').setAttribute("onclick" , undefined);
	document.getElementById('menus_button_geocoder').addEventListener('click' , hideMenu);

	// We display the div menu
	document.getElementById('menu').style.width = '350px';

	// We change the BG color of the button
	document.getElementById('menus_button_geocoder').style.backgroundColor = 'rgba(180,180,180,1)';

	// We change the title
	document.getElementById('menu_container_title').innerHTML = 'MENU RECHERCHE';

	// We add the geocoder div
	document.getElementById('div_geocoder_menu').style.display = 'block';

    // We add the content
    document.getElementById('div_geocoder_menu').innerHTML = "<div style='width:100%;height:auto;display:flex;overflow:auto;'><div style='width:20px;'></div><div style='width:100%;height:auto;overflow:auto;'><h3 style='color:white;font-family:Ubuntu;'>Adresse:</h3><input type='text' id='adress_geocoder_input' class='geocoder_input'><div style='height:15px;'></div><h3 style='color:white;font-family:Ubuntu;'>Ville:</h3><input type='text' id='city_geocoder_input' class='geocoder_input'><div style='height:30px;'></div><button id='search_geocoder_button'><h3>RECHERCHER</h3></button><div style='height:10px;'></div><div style='width:100%;display:flex;'><p id='status_geocoder_text' style='margin:auto;'></p></div><div style='height:30px;'></div><h3 style='color:white;font-family:Ubuntu;'>Marqueurs placés:</h3><div style='height:10px;'></div><div id='search_marker_container' style='height:auto;width:auto;'></div></div><div style='width:20px;'></div></div>";

	// We add the event for research
	document.getElementById('search_geocoder_button').addEventListener('click' , searchLocation)

    // Load the search marker
    addMarkerGeocoder();

	// We set the variable Opened Menu
	window.OPENED_MENU = 'Geocoder';

}




/**
 * Function that get the coords of a given adress
 * 
 */
function searchLocation(){
    // get adress
    var adress = document.getElementById('adress_geocoder_input').value;
    // get city
    var city = document.getElementById('city_geocoder_input').value;

    // ask geocoder data . gouv
    fetch("https://api-adresse.data.gouv.fr/search/?q="+adress+"+"+city)
    .then(a => a.json())
    .then(a => {
        // get the data
        if (a.features.length == 0){
            // add message not found
            document.getElementById('status_geocoder_text').style.color = 'red';
            document.getElementById('status_geocoder_text').innerHTML = 'Aucun résultat';

        } else {
            var data = a.features[0].properties

            // if the score is less than 0.5 -> not found
            if (data.score < 0.4){
                // add message not found
                document.getElementById('status_geocoder_text').style.color = 'red';
                document.getElementById('status_geocoder_text').innerHTML = 'Aucun résultat';


            } else {
                // add message found
                document.getElementById('status_geocoder_text').style.color = 'green';
                document.getElementById('status_geocoder_text').innerHTML = 'Trouvé: ' + data.label;

                // remove input value
                document.getElementById('adress_geocoder_input').value = '';
                document.getElementById('city_geocoder_input').value = '';

                // convert coords in WGS84
                var coords = lambert93toWGPS(data.x, data.y);

                // get POI layer
                var layerPoi = listePOIs.getLayerById(0);

                // set an id for this marker
                var id = layerPoi.data.length;

                // add a marker image on the map
                layerPoi.data.add({
                    position : new Cesium.Cartesian3.fromDegrees(coords.longitude, coords.latitude, 130),
                    eyeOffset : new Cesium.Cartesian3(0.0,0.0,-100.0), // Negative Z will make it closer to the camera
                    image : 'media/img/geocoder_marker.png',
                    scale : 0.05,
                    verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                    heightReference : Cesium.HeightReference.NONE
                });

                layerPoi.data.get(id).ID = id;
                layerPoi.data.get(id).NAME = data.label;
                
                // We modify the alt of the POI
                getAltiIGN(coords.latitude , coords.longitude).then(a => {
                    var h = a.elevations[0] + 42 + 10;
                    // update height of the poi
                    listePOIs.getLayerById(0).getPoiById(id).position = Cesium.Cartesian3.fromDegrees(coords.longitude , coords.latitude , h);
                    
                    // move the camera
                    geocoderFlyTo(id);
                });

                // add the marker and event to the list
                addMarkerGeocoder();
                
            }
        }
        
    });
}

/**
 * Function that put the camera to the marker
 * 
 * @param {int} id ID of the POI
 */
function geocoderFlyTo(id){
    // get coords
    var coords = listePOIs.getLayerById(0).getPoiById(id).position
    // transform in Lon, Lat, height
    coords = Cesium.Cartographic.fromCartesian(coords);
    // add 300m height and 300m south
    coords.height += flyToPOIDistance*300;
    coords.latitude -= flyToPOIDistance*300*coords.latitude/RAYON_TERRE;
    // coords to Cartesian
    coords = Cesium.Cartesian3.fromDegrees(coords.longitude*180/Math.PI, coords.latitude*180/Math.PI, coords.height)
    // move the camera
    viewer.camera.flyTo({
        destination : coords,
        orientation : {
            heading : Cesium.Math.toRadians(0.0),
            pitch : -Math.PI/4
        }
    });
}

/**
 * Function that destroy a search marker
 *
 * @param {int} id ID of the POI to remove 
 */
function geocoderDelMarker(id){
    // remove the point
    var billboard = listePOIs.getLayerById(0).getPoiById(id);
    listePOIs.getLayerById(0).data.remove(billboard)
    
    //remove the container
    document.getElementById('search_marker_container_'+id).remove();

    // update
    viewer.scene.requestRender();
}

function addMarkerGeocoder() {
    // init html
    document.getElementById('search_marker_container').innerHTML = '';

    // get POI layer
    var layerPoi = listePOIs.getLayerById(0);

    // For every search marker
    for(var i = 0 ; i < layerPoi.data.length ; i++){
        var poi = layerPoi.data.get(i);

        // html
        var html = "<div id='search_marker_container_"+poi.ID+"' style='width:100%;height:55px;'>"
        html += "<div style='width:100%;height:50px;display:flex;'>"
        html += "<div id='search_marker_container_fly_"+poi.ID+"' class='search_marker_container_fly' onclick=''><h3>"+poi.NAME+"</h3></div>";
        html += "<div id='search_marker_container_del_"+poi.ID+"' class='search_marker_container_del'><h3>X</h3></div>";
        html += "</div>"
        html += "<div style='height:5px;'></div>";
        html += "</div>"
        document.getElementById('search_marker_container').innerHTML += html;

        // add event listener on this marker
        document.getElementById('search_marker_container_fly_'+poi.ID).setAttribute('onclick' , 'geocoderFlyTo('+poi.ID+');');
        document.getElementById('search_marker_container_del_'+poi.ID).setAttribute('onclick' , 'geocoderDelMarker('+poi.ID+');')
    }
}