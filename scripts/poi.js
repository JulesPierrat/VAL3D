/**
*Function that open the layers menu
**/
function openPoiMenu(){
	// Si une autre page est ouverte
	if (window.OPENED_MENU != 'null'){
		hideMenu();
	}

	// We change is event on click
	document.getElementById('menus_button_poi').setAttribute("onclick" , undefined);
	document.getElementById('menus_button_poi').addEventListener('click' , hideMenu);

	// We display the div menu
	document.getElementById('menu').style.width = '350px';

	// We change the BG color of the button
	document.getElementById('menus_button_poi').style.backgroundColor = 'rgba(180,180,180,1)';

	// We change the title
	document.getElementById('menu_container_title').innerHTML = 'MENU POI';

	// We add the layers option div
	document.getElementById('div_poi_menu').style.display = 'block';

    // We add content to POI Menu
    document.getElementById('div_poi_menu').innerHTML = "<div id='div_poi_menu' style='display:block;width:100%;height:100%'><div style='width:100%;height:auto;display:flex;overflow:auto;'><div style='width:20px;'></div><div id='container_poi_menu' style='width:100%;height:auto;overflow:auto;'></div><div style='width:20px;'></div></div></div>";

	// get the list of poi
    getViewablePoi();

	// We set the variable Opened Menu
	window.OPENED_MENU = 'Poi';

}



/**
 * Function that init all the POI layer find in the BDD
 * 
 */
function initPOI(){

    fetch('php/getPoi.php').then(a => a.json()).then(a => {
        a.forEach(p => {
            // create config with db
            var cfg = {
                id: parseInt(p.id),
                name: p.Nom,
                path: p.Path,
                meta: p.Meta || {}
            };

            // create a POI Layer Object
            var PoiLayer = new POILayer(cfg);

            // add it to the liste of poi layer
            listePOIs.addPOILayer(PoiLayer);
        });
    });
}



/**
 * Function that get the list of the accessible POI
 * 
 */
function getViewablePoi(){
    // empty the menu container
    document.getElementById('container_poi_menu').innerHTML = '';
    var html = '';
    var liste_layer_displayed = [];
    listePOIs.data.forEach(p => {
        // ignore id 0
        if(p.id != 0){
            // test if the poi layer is already displayed
            if(p.displayed){
                liste_layer_displayed.push('poi_liste_button_'+p.id);
            }

            // add button
            html += "<button id='poi_liste_button_"+p.id+"' class='poi_liste_button'><h3>"+p.name+"</h3></button></div>";
            html += "<div style='height:7px;'></div>";
        }
    });

    // add the html content to the page
    document.getElementById('container_poi_menu').innerHTML = html;

    // change color of displayed layers poi
    for(var i = 0 ; i < liste_layer_displayed.length ; i++){
        document.getElementById(liste_layer_displayed[i]).style.backgroundColor = "#009EDF";
    }
    
    // set the event listener
    document.querySelectorAll('.poi_liste_button').forEach(p => {
        // if not displayed
        if(liste_layer_displayed.indexOf(p.id) == -1){
            p.addEventListener('click' , loadPoi)
        }else{
            p.addEventListener('click' , removeLayerPoi)
        }
    });
}

/**
 * Function that load all the poi choosen
 * 
 * @param {event} e
 */
function loadPoi(e){
    // get the id of the poi
    var id = parseInt(e.currentTarget.id.split('_')[3]);

    // draw all the poi
    listePOIs.getLayerById(id).drawAllPoi();

    // close menu
    hideMenu();

}

/**
 * Function that remove a layer of Poi
 * 
 * @param {event} e Event to remove a layer of poi
 */
function removeLayerPoi(e){
    // get the id of the poi
    var id = parseInt(e.currentTarget.id.split('_')[3]);

    // destroy layerPoi
    listePOIs.getLayerById(id).remove();

    // relaod page
    getViewablePoi();
}



/**
 * Function that open a modal to display POI information
 * 
 * @param {int} layerId Id of the POI layer clicked
 * @param {int} poiId Id of the clicked POI in this layer
 */
function getPOIInfo(layerId , poiId){
    // get layer
    var layerPoi = listePOIs.getLayerById(layerId);

    // replace contain in HTML with dico
    fetch(layerPoi.path + '/preset.html').then(html => html.text()).then(html => {
        fetch(layerPoi.path + '/dico.json').then(dico => dico.json()).then(dico => {
            // get properties
            var properties = JSON.stringify(dico);
            properties = properties.substring(1,properties.length-1);
            properties = properties.split(',');

            properties.forEach(a => {
                a = a.split(':')[0]
                a = a.substring(1,a.length-1)

                // replace in the html text
                html = html.replace(a , layerPoi.json_data[poiId].properties[dico[a]])
            })

            openPoiModal(html);
        });
    });

}

/**
 * Function that open the POI modal with all the infos
 * 
 * @param {string} html HTML code that will be display for this Poi in the modal
 */
function openPoiModal(html){
    // hide menu
    hideMenu();

    // change contain
    document.getElementById('modal_POI_container').innerHTML = html;

    // display the modal
    document.getElementById('modal_POI').style.display= 'flex';

    // add EventListener on modalPOI
    document.getElementById('modal_POI').addEventListener('click' , closePoiModal)

}

/**
 * Function that close the opened poi modal
 * 
 * @param {event} e Event when we click on the modal
 */
function closePoiModal(e){
    if(e.currentTarget == e.target){
        e.currentTarget.removeEventListener('click' , closePoiModal);
        document.getElementById('modal_POI').style.display = 'none';
    }
}

