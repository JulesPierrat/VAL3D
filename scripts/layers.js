/**
*Function that open the layers menu
**/
function openLayersMenu(){
	// Si une autre page est ouverte
	if (window.OPENED_MENU != 'null'){
		hideMenu();
	}

	// We change is event on click
	document.getElementById('menus_button_layers').setAttribute("onclick" , undefined);
	document.getElementById('menus_button_layers').addEventListener('click' , hideMenu);

	// We display the div menu
	document.getElementById('menu').style.width = '350px';

	// We change the BG color of the button
	document.getElementById('menus_button_layers').style.backgroundColor = 'rgba(180,180,180,1)';

	// We change the title
	document.getElementById('menu_container_title').innerHTML = 'MENU COUCHES';

	// We add the layers option div
	document.getElementById('div_layers_menu').style.display = 'block';

	// We set the variable Opened Menu
	window.OPENED_MENU = 'Layers';

    // load layers in this menu
    loadLayersInMenu();

}





/**
* Function that create all the div of layer menu
* 
*/
function loadLayersInMenu(){
    // reset content
    document.getElementById('div_layers_menu').innerHTML = "<div style='width:100%;height:40px;display:flex;text-align: left;margin: auto;'><div style='width:20px;'></div><p>Couches visibles uniquement</p><div style='width:10px;'></div><div id='button_switch_mlayers' style='width:40px;height:20px;background-color: white;border-radius: 10px;position:relative;transition:0.5s;'><div id='button_switch_mlayers_circle' style='width:18px;height:18px;background-color:rgba(100,100,100,1);border-radius: 9px;position:absolute;top:1px;left:1px;transition:0.5s;'></div></div></div><div id='all_layer_display_menu' style='width:100%;height:auto;display:flex;overflow:auto;'><div style='width:20px;'></div><div style='width:100%;'><div id='group_container' style='width:100%;'></div></div><div style='width:20px;'></div>	</div><div id='visible_layer_display_menu' style='width:100%;display:none;overflow:auto;'><div style='width:20px;'></div><div id='visible_layer_display_menu_container' style='width:100%;display:block;'></div><div style='width:20px;'></div>	</div>";

    // LAYERS MENU SWITCH
	document.getElementById('button_switch_mlayers').addEventListener('click' , switchMenuLayers);

    // get var listeLayers
    allLayers = listeLayers;

    // Get the list of all categoria
    var groupes = listeLayers.getAllGroup();
    
    // Create a div for all the categoria
    for(var i = 0 ; i<groupes.length ; i++){
        // Check if there if an accessible layer in the group
        var layers_in_group = listeLayers.getLayersByGroup(groupes[i]);
        var groupe_access = false;
        layers_in_group.forEach(l => {
            if (l.access){
                groupe_access = true;
            }
        });

        if (groupe_access ) {
            var html = "<button id='menu_group_"+i+"' class='menu_group'><h2>"+groupes[i]+"</h2></button><div id='menu_group_container_"+i+"' class='menu_group_container' style='height:0px;display:none;'></div><div style='height:10px;'></div>";
            document.getElementById('group_container').innerHTML += html;
        
            // Add every Layers of this groups
            for (var j = 0;j < layers_in_group.length ; j++){
                if (layers_in_group[j].access) {
                    var cross = 'x';
                    if (!layers_in_group[j].isDisplay){
                        cross = '+';
                    }
                    var html = "<div id='layer_in_menu_"+layers_in_group[j].id+"' class='layer_in_menu'><h2>"+layers_in_group[j].nom+"</h2><button id='layer_in_menu_cross_"+layers_in_group[j].id+"' class='layer_in_menu_cross'><h2 id='layer_in_menu_cross_label_"+layers_in_group[j].id+"'>"+cross+"</h2></button></div><div style='height:5px;'></div>"
                    document.getElementById('menu_group_container_'+i).innerHTML += html;
                }
            }
        }
        // Add event listenner to group of layer
        document.querySelectorAll('.menu_group').forEach(a => {
            a.addEventListener('click' ,  openGroupLayers);
        });
    }

    // Add event listener on click for each layers
    for(var k = 0 ; k < listeLayers.layers.length ; k++){
        if (listeLayers.layers[k].access) {
            if (listeLayers.layers[k].isDisplay){
                document.getElementById('layer_in_menu_cross_'+listeLayers.layers[k].id).addEventListener('click', removeLayerFromViewer);
            } else {
                document.getElementById('layer_in_menu_cross_'+listeLayers.layers[k].id).addEventListener('click', addLayerToViewer);
            }
        }
    }
}

/**
 * Function that let you remove a layer from the viewer
 * 
 */
function removeLayerFromViewer(e){
    // On récupère l'id du layer
    var id = e.currentTarget.id.split('_')[4];

    // On supprime l'event
    e.currentTarget.removeEventListener('click', removeLayerFromViewer);

    // We destroy the layer from the viewers
    listeLayers.getLayerById(id).destroy();    

    // We change the text in +
    document.getElementById('layer_in_menu_cross_label_'+id).innerHTML = '+';

    // We add the new event listener
    e.currentTarget.addEventListener('click' , addLayerToViewer);

    // if we are on displayed page
    if (e.currentTarget.id.split('_')[3] == ''){
        updateVisibleLayersInMenu();
    }
}


/**
 * Function that let you add a layer to the viewer
 * 
 */
 function addLayerToViewer(e){
    // On récupère l'id du layer
    var id = e.currentTarget.id.split('_')[4];

    // we delete the event
    e.currentTarget.removeEventListener('click' , addLayerToViewer);

    // We add the layer from the viewer
    listeLayers.getLayerById(id).construct();

    // we change the + by a x
    document.getElementById('layer_in_menu_cross_label_'+id).innerHTML = 'x';

    // We add the new event listener
    e.currentTarget.addEventListener('click' , removeLayerFromViewer);
}


/**
 * Function that display the visible layers in the menu
 * 
 */
 function updateVisibleLayersInMenu(){
	// remove all event listener
	document.querySelectorAll('.visible_layer_loc').forEach(a => {
        a.removeEventListener('click' , flyToLayer);
    });
	document.querySelectorAll('.visible_layer_del').forEach(a => {
        a.removeEventListener('click' , removeLayerFromViewer);
    });

	// get the container
	var container = document.getElementById('visible_layer_display_menu_container');

	// initiate the html of the container
	var html = '';

	// set the html content
	for(var i = 0 ; i < listeLayers.layers.length ; i++){
		// if the layer is displayed
		if (listeLayers.layers[i].isDisplay){
			// add buton
			html += '<div id="visible_layer_'+i+'" class="visible_layer">';
			// Add name
			html += '<div class="visible_layer_name"><h2>'+listeLayers.layers[i].nom+' - '+listeLayers.layers[i].group+'</h2></div>';
			// Add button to loc
			html += '<div id="visible_layer_loc__'+listeLayers.layers[i].id+'" class="visible_layer_loc" ><img src="media/img/loc_element.png" width="40px" height="40px" style="margin:auto;"></div>'
			html += '<div id="visible_layer_del__'+listeLayers.layers[i].id+'" class="visible_layer_del" ><img src="media/img/del_element.png" width="40px" height="40px" style="margin:auto;"></div>'
			html += '</div>';

			// add litle space
			html += '<div style="height:10px;"></div>'
		}
	}

	// put html in container
	container.innerHTML = html;

    // Add event listener
    document.querySelectorAll('.visible_layer_loc').forEach(a => {
        a.addEventListener('click' , flyToLayer);
    });
	document.querySelectorAll('.visible_layer_del').forEach(a => {
        a.addEventListener('click' , removeLayerFromViewer);
    });
}

/**
 * Function that let the camera move to see the selected layer
 * 
 */
function flyToLayer(e){
    //get the id of the layer
    var id = e.currentTarget.id.split('_')[4];
    var type = listeLayers.getLayerById(id).type;
    var data = listeLayers.getLayerById(id).data;
    
    // set the view
    if(type == "3dtiles" || type == "vecS"){
        if(type=='3dtiles'){
            // Get info about layers'bounding
            var r = data.boundingSphere.radius;
            var coords = Cesium.Cartographic.fromCartesian(data.boundingSphere.center);

            // Get r in angle
            var dphi = r/6380000

            // Transform coords
            coords.latitude = coords.latitude - flyToLayerDistance*dphi;
            coords.height = coords.height + flyToLayerDistance*r;

            // Geographic to Cartesian
            coords = Cesium.Cartesian3.fromDegrees(coords.longitude, coords.latitude, coords.height);

            // Set the camera
            viewer.camera.flyTo({
                destination : new Cesium.Cartesian3(coords.x, coords.y, coords.z),
                orientation : {
                  heading : Cesium.Math.toRadians(0.0),
                  pitch : -Math.PI/2
                }
            });

        }
    } else {
        viewer.camera.flyTo({
            destination : new Cesium.Cartesian3(4231278.189128528, 181738.561927225, 4772828.905668535),
            orientation : {
              heading : Cesium.Math.toRadians(0.0),
              pitch : -0.6999665236493904
            }
        });
    }
}

/**
*Function that switch the layer menu
*
**/
function switchMenuLayers(){
	// get web element
	var circle = document.getElementById('button_switch_mlayers_circle');
	var button = document.getElementById('button_switch_mlayers');

	// if all layers are display
	if (window.ALL_LAYERS_VISIBLE_IN_MENU == 'true'){
		// Update content
		updateVisibleLayersInMenu();

		//Change color of circle
		circle.style.backgroundColor = '#009EDF';

		//translate circle
		circle.style.left = '21px';

		//change bg color
		button.style.backgroundColor = '#99CCE1';

		//change variable
		window.ALL_LAYERS_VISIBLE_IN_MENU = 'false';

		//Update display
		document.getElementById('visible_layer_display_menu').style.display = 'flex';
		document.getElementById('all_layer_display_menu').style.display = 'none';

	
	// if only visible layers are displayed
	} else {

		//Change color of circle
		circle.style.backgroundColor = 'rgba(100,100,100,1)';

		//translate circle
		circle.style.left = '1px';

		//change bg color
		button.style.backgroundColor = 'white';

		//change variable
		window.ALL_LAYERS_VISIBLE_IN_MENU = 'true';

		// Update display
		document.getElementById('visible_layer_display_menu').style.display = 'none';
		document.getElementById('all_layer_display_menu').style.display = 'flex';

	}

}


/**
 * Function that open a group of layers in menu
 * 
 */
function openGroupLayers(e){
	// remove event listener
	e.currentTarget.removeEventListener('click' , openGroupLayers);

	// Get the id of the group
	var id = parseInt(e.currentTarget.id.split('_')[2]);

	// Set the height auto and display block
	document.getElementById('menu_group_container_'+id).style.display = "block";
	document.getElementById('menu_group_container_'+id).style.height = "auto";

	// set the new event listener
	e.currentTarget.addEventListener('click' , closeGroupLayers)
		
}

/**
 * Function that open a group of layers in menu
 * 
 */
 function closeGroupLayers(e){
	// remove event listener
	e.currentTarget.removeEventListener('click' , closeGroupLayers);

	// Get the id of the group
	var id = parseInt(e.currentTarget.id.split('_')[2]);

	// Set the height to 0 and the display none
	document.getElementById('menu_group_container_'+id).style.display = "none";
	document.getElementById('menu_group_container_'+id).style.height = "0px";

	// set the new event listener
	e.currentTarget.addEventListener('click' , openGroupLayers);
		
}