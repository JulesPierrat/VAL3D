/**
*Function that open the style menu
*
**/
function openStylesMenu(){
	// Si une autre page est ouverte
	if (window.OPENED_MENU != 'null'){
		hideMenu();
	}

	// We change it event on click
	document.getElementById('menus_button_styles').setAttribute("onclick" , undefined);
	document.getElementById('menus_button_styles').addEventListener('click' , hideMenu);

	// We display the div menu
	document.getElementById('menu').style.width = '350px';

	// We change the BG color of the button
	document.getElementById('menus_button_styles').style.backgroundColor = 'rgba(180,180,180,1)';

	// We change the title
	document.getElementById('menu_container_title').innerHTML = 'MENU STYLES';

	// we add the style option div
	document.getElementById('div_styles_menu').style.display = 'block';

  // we load every element inside
  document.getElementById('div_styles_menu').innerHTML = "<div id='all_layer_display_menu' style='width:100%;height:auto;display:flex;overflow:auto;'><div style='width:20px;'></div><div style='width:100%;height:auto;overflow:auto;'><div class='select-box'><label for='select-box1' class='label select-box1'><span id='selected_layer_in_style_menu' class='label-desc'>Choisir une couche</span> </label><select id='select-box1' class='select'></select><div id='style_container' style='width:100%;height:auto;margin-top:15px;'></div></div></div><div style='width:20px;'></div></div>";

	// load layers in selector
	loadVisibleLayersInStyleMenu();

	// We set the variable Opened Menu
	window.OPENED_MENU = 'Styles';

}









/**
 * Function that load the visible layers in style menu
 * 
 */
 function loadVisibleLayersInStyleMenu(){
  // get the <select> element
  var selector = document.getElementById('select-box1')

  // set the html variable
  var html = '';
  var isFirst = true;

  // open 3dtiles group
  html += '<optgroup label="PHOTOMAILLAGE">';

  // add visible raster layers
  var n = listeLayers.layers.length;
  for(var i = 0; i < n ; i++){
      if (listeLayers.layers[i].isDisplay  && listeLayers.layers[i].type == '3dtiles'){
          html += '<option value="layer_'+listeLayers.layers[i].id+'"';
    if (isFirst){
      isFirst = false;
      html += ' selected ';
    }
    html += '>'+listeLayers.layers[i].nom+'</option>';
      }
  }

  // close raster group
  html += '</optgroup>';

  // open raster group
  html += '<optgroup label="COUCHES RASTER">';

  // add visible raster layers
  var n = listeLayers.layers.length;
  for(var i = 0; i < n ; i++){
      if (listeLayers.layers[i].isDisplay  && listeLayers.layers[i].type.split('imagery').length == 2){
          html += '<option value="layer_'+listeLayers.layers[i].id+'"';
    if (isFirst){
      isFirst = false;
      html += ' selected ';
    }
    html += '>'+listeLayers.layers[i].nom+'</option>';
      }
  }

  // close raster group
  html += '</optgroup>'

  // open vector group
  html += '<optgroup label="COUCHES VECTEURS">'

  // add visible vector layers
  var n = listeLayers.layers.length;
  for(var i = 0; i < n ; i++){
      if (listeLayers.layers[i].isDisplay  && listeLayers.layers[i].type.split('vect').length == 2){
          html += '<option value="layer_'+listeLayers.layers[i].id+'"';
    if (isFirst){
      isFirst = false;
      html += ' selected ';
    }
    html += '>'+listeLayers.layers[i].nom+'</option>';
      }
  }

  // close vector group
  html += '</optgroup>'

  selector.innerHTML = html;

// Add script of selection
clickOnSelector(selector);
selector.addEventListener('change', clickOnSelector);
}

/**
* Function when we click on a selector
* 
*/
function clickOnSelector(e){
  // get id of the layers
  if(e.target == undefined){
    var id = parseInt(e.value.split('_')[1]);
  } else {
    var id = parseInt(e.target.value.split('_')[1]);
  }

  // Set the name of the Selector
  if(listeLayers.getLayerById(id) == undefined){
    document.getElementById('selected_layer_in_style_menu').innerHTML = "Aucune couche visible n'est stylisable"
  } else {
    document.getElementById('selected_layer_in_style_menu').innerHTML = listeLayers.getLayerById(id).nom;
  }

  // delete the content of the style container
  document.getElementById("style_container").innerHTML = '';

  // Set the new content of the style container
  if(listeLayers.getLayerById(id) != undefined){
    setStyleContainer(id);
  }
}


/**
 * 
 * Function that transform rgb to hex color
 * 
 * @param {int} r
 * @param {int} g
 * @param {int} b
 */
 function RGBToHex(r,g,b) {
	r = r.toString(16);
	g = g.toString(16);
	b = b.toString(16);
  
	if (r.length == 1)
	  r = "0" + r;
	if (g.length == 1)
	  g = "0" + g;
	if (b.length == 1)
	  b = "0" + b;
  
	return "#" + r + g + b;
  }

/**
 * Function that transform hex to rgb
 * 
 * @param {string} hex
 *  
 */
 function hex2rgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }


/**
 * Function  that set the style container depending of the if layer
 * 
 * @param {int} id
 * 
 */
function setStyleContainer(id){
	// get the layer depending of the id
	var layer = listeLayers.getLayerById(id);

	// get style container
	var container = document.getElementById('style_container');
  container.innerHTML = '';

  // if the layer is a 3dtiles
	if (layer.type == '3dtiles'){
		// add opacity manager
		container.innerHTML += '<h2>Luminosité :</h2>';
    container.innerHTML += '<div style="height:2px;background-color:white;"><div>';
    container.innerHTML += '<div style="height:10px;"></div>';
		container.innerHTML += '<input id="lumix_selector_'+id+'" class="opacity_selector"  type="range" min="0" max="100" value="'+listeLayers.getLayerById(id).lumix*100+'">'
    // add default style
    container.innerHTML += '<div style="height:20px;"></div>';
    container.innerHTML += '<button id="default_style_'+id+'" class="default_style">STYLE PAR DEFAULT</button>';

    // add event listener for opacity
    document.getElementById('lumix_selector_'+id).addEventListener('change', change3DTilesLayerOpacity);

	// else it is a raster or a vector
	} else {
    // if the layer is a raster
    if (layer.type.split('imagery').length == 2){
      // add opacity manager
      container.innerHTML += '<h2>Opacité:</h2>';
      container.innerHTML += '<div style="height:2px;background-color:white;"><div>';
      container.innerHTML += '<div style="height:10px;"></div>';
      container.innerHTML += '<input id="opacity_selector_'+id+'" class="opacity_selector"  type="range" min="0" max="100" value="'+listeLayers.getLayerById(id).getOpacity()*100+'">'

      // add under / on manager
      container.innerHTML += '<div style="height:30px;"><div>';
      container.innerHTML += '<h2>Positions:</h2>';
      container.innerHTML += '<div style="height:2px;background-color:white;"><div>';
      container.innerHTML += '<div style="height:10px;"></div>';
      container.innerHTML += '<button id="put_first_'+id+'" class="position_style">Mettre au premier plan</button>';
      container.innerHTML += '<div style="height:5px;"></div>';
      container.innerHTML += '<button id="put_last_'+id+'" class="position_style">Mettre au dernier plan</button>';

      // add event listener for opacity
      document.getElementById('opacity_selector_'+id).addEventListener('change', changeRasterLayerOpacity);

      // add event for first plan
      document.getElementById('put_first_'+id).addEventListener('click', changeRasterPosition);

      // add event for last plan
      document.getElementById('put_last_'+id).addEventListener('click', changeRasterPosition);
      

    // else it is a vector
    } else {
      if(layer.type.split('S').length >= 2 || layer.type.split("V").length >= 2){
        // add the param of fill
        container.innerHTML += '<h2>Contenu:</h2>';
        container.innerHTML += '<div style="width:100%;height:1px;background-color:white;"></div>'
        container.innerHTML += '<div style="height:10px;"></div>';
        // add color fill param
        var fillColor = layer.getColor();
        var fcolor = RGBToHex(fillColor.red*255,fillColor.green*255,fillColor.blue*255);
        container.innerHTML += '<div style="display:flex;"><h3 style="color:white;font-family:Ubuntu;">Couleur: </h3><div style="width:30px;"></div><input id="cfill_selector_'+id+'" class="color_selector" type="color" value="'+fcolor+'"></div>';

        // add fill opacity
        container.innerHTML += '<div style="display:flex;"><h3 style="color:white;font-family:Ubuntu;">Opacité: </h3><div style="width:30px;"></div><input id="ofill_selector_'+id+'" class="opacity_selector" type="range" min="0" max="100" value="'+fillColor.alpha*100+'"></div>'
      }

      if (layer.type.split('L').length >= 2 || layer.type.split('C').length >= 2){
        // add the param of fill
        container.innerHTML += '<h2>Trait:</h2>';
        container.innerHTML += '<div style="width:100%;height:1px;background-color:white;"></div>'
        container.innerHTML += '<div style="height:10px;"></div>';
        // add color stroke param
        var strokeColor = layer.getColor();
        var scolor = RGBToHex(strokeColor.red*255,strokeColor.green*255,strokeColor.blue*255);
        var width = viewer.entities.getById(layer.data.CesiumPolyline[0].id).polyline.width;
        container.innerHTML += '<div style="display:flex;"><h3 style="color:white;font-family:Ubuntu;">Couleur: </h3><div style="width:30px;"></div><input id="cstroke_selector_'+id+'" class="color_selector" type="color" value="'+scolor+'"></div>';

        // add stroke opacity
        container.innerHTML += '<div style="display:flex;"><h3 style="color:white;font-family:Ubuntu;">Epaisseur: </h3><div style="width:30px;"></div><input id="width_selector_'+id+'" class="width_selector" type="number" min="1" max="50" value="'+width+'"></div>'
      }

      // add default style
      container.innerHTML += '<div style="height:20px;"></div>';
      container.innerHTML += '<button id="default_style_'+id+'" class="default_style">STYLE PAR DEFAULT</button>';

      // add attribute style
      container.innerHTML += '<div style="height:10px;"></div>';
      container.innerHTML += '<button id="attribute_style_'+id+'" class="attribute_style">STYLE PAR ATTRIBUT</button>';
      container.innerHTML += '<div style="height:20px;"></div>';

      // add Etiquette text
      container.innerHTML += '<h2>Etiquettes:</h2>';
      container.innerHTML += '<div style="width:100%;height:1px;background-color:white;"></div>'
      container.innerHTML += '<div style="height:10px;"></div>';

      // add Etiquette button
      var text_button_etiquette = 'Ajouter une étiquette';
      if (layer.isLabeled) {
        text_button_etiquette = "Supprimer l'étiquete";
      }
      container.innerHTML += '<button id="etiquette_style_'+id+'" class="attribute_style">'+text_button_etiquette+'</button>';
      container.innerHTML += '<div style="height:20px;"></div>';

      // add Legend text
      container.innerHTML += '<h2>Légende:</h2>';
      container.innerHTML += '<div style="width:100%;height:1px;background-color:white;"></div>'
      container.innerHTML += '<div style="height:10px;"></div>';
      container.innerHTML += '<div style="height:20px;"></div>';

      if(layer.type.split('S').length >= 2 || layer.type.split("V") >= 2){
        //add event listener for color
        document.getElementById('cfill_selector_'+id).addEventListener('change' , changeLayerFillColor);
        // add event listener for opacity
        document.getElementById('ofill_selector_'+id).addEventListener('change', changevectLayerFillOpacity);
      }

      if (layer.type.split('L').length >= 2 || layer.type.split('C').length >= 2 ){
        //add event listener for color
        document.getElementById('cstroke_selector_'+id).addEventListener('change' , changeLayerStrokeColor);
        // add event listener for opacity
        document.getElementById('width_selector_'+id).addEventListener('change', changevectLayerStrokeSize);
      }
      

      // add event listener for default style
      document.getElementById('default_style_'+id).addEventListener('click', setDefaultStyle);

      // add event listener for attribute style
      document.getElementById('attribute_style_'+id).addEventListener('click', getListOfAttributes);

      // add event for the etiquette button
      document.getElementById('etiquette_style_'+id).addEventListener('click', manageEtiquette);
    }
  }
}

/** 
 * Function that change a layer color
 * 
 * @param {event} e
 * 
 */
function changeLayerFillColor(e){
  // get id of layer
  var id = parseInt(e.currentTarget.id.split('_')[2]);

  // get layer
  var layer = listeLayers.getLayerById(id);

  // define color
  var c =  hex2rgb(e.currentTarget.value)
  var color = new Cesium.Color(c.r/255,c.g/255,c.b/255,layer.getColor().alpha);

  // set color
  for (var i = 0 ; i < layer.data.entities.values.length ; i++){
      layer.data.entities.values[i].polygon.material = color;
  }

  // Update liste
  listeLayers.update(layer);

  // Reload scene
  viewer.scene.requestRender();
    
}

/**
 * Function that change the stroke color of a layer
 * 
 * @param {event} e
 */
function changeLayerStrokeColor(e){
  // get id of layer
  var id = parseInt(e.currentTarget.id.split('_')[2]);

  // get layer
  var layer = listeLayers.getLayerById(id);

  // define color
  var c =  hex2rgb(e.currentTarget.value)
  var color = new Cesium.Color(c.r/255,c.g/255,c.b/255,layer.getColor().alpha);

  // set color
  for (var i = 0 ; i < layer.data.CesiumPolyline.length ; i++){
      viewer.entities.getById(layer.data.CesiumPolyline[i].id).polyline.material = color;
  }

  // Update liste
  listeLayers.update(layer);

  // Reload scene
  viewer.scene.requestRender();
}



/**
 * Function that change the opacity of a vector layer
 * 
 * @param {event} e
 * 
 */
function changevectLayerFillOpacity(e){
    // get id of the layer
    var id = parseInt(e.currentTarget.id.split('_')[2]);
    
    // get layer
    var layer = listeLayers.getLayerById(id);

    //get opacity
    var opacity = e.currentTarget.value/100;

    // set color
    for (var i = 0 ; i < layer.data.entities.values.length ; i++){
      var color = layer.data.entities.values[i].polygon.material.color.getValue();
      color.alpha = opacity;
      layer.data.entities.values[i].polygon.material.color.setValue(color);
    }

    // Update liste
    listeLayers.update(layer);

    // Reload scene
    viewer.scene.requestRender();

}

/**
 * Function that change the stroke opacity of a vector layer
 * 
 * @param {event} e
 * 
 */
 function changevectLayerStrokeSize(e){
  // get id of the layer
  var id = parseInt(e.currentTarget.id.split('_')[2]);
  
  // get layer
  var layer = listeLayers.getLayerById(id);

  //get opacity
  var width = e.currentTarget.value;

  // set color
  for (var i = 0 ; i < layer.data.CesiumPolyline.length ; i++){
    viewer.entities.getById(layer.data.CesiumPolyline[i].id).polyline.width = width;
  }

  // Update liste
  listeLayers.update(layer);

  // Reload scene
  viewer.scene.requestRender();

}

/**
 * Function that change the opacity of a raster layer
 * 
 * @param {event} e
 * 
 */
 function changeRasterLayerOpacity(e){
    // get id of the layer
    var id = parseInt(e.currentTarget.id.split('_')[2]);
    
    // get layer
    var layer = listeLayers.getLayerById(id);
    // get imagery provider id
    var imageryId = -1;
    for(var i = 0 ; i < viewer.imageryLayers._layers.length ; i++){
        if(viewer.imageryLayers._layers[i].imageryProvider == layer.data || viewer.imageryLayers._layers[i].imageryProvider == layer.data.imageryProvider){
            imageryId = i;
        }
    }

    //set opacity
    viewer.imageryLayers._layers[imageryId].alpha = e.currentTarget.value/100;

    // Update liste
    listeLayers.update(layer);

    // Reload scene
    viewer.scene.requestRender();

}

/**
 * Function that set the default style of a layer
 * 
 * @param {event} e
 * 
 */
function setDefaultStyle(e){
  // get the layer's id
  var id = parseInt(e.currentTarget.id.split('_')[2]);

  // get the layer
  var layer = listeLayers.getLayerById(id);

  // reset style
  layer.setDefaultStyle();

  // Update liste
  listeLayers.update(layer);

  // reload style container
  setStyleContainer(id);

  // Reload scene
  viewer.scene.requestRender();

}

/**
 * Function that display the list of geojson attribute in buttons for style
 * 
 * @param {event} e
 * 
 */
function getListOfAttributes(e){
  // get container
  var container = document.getElementById('style_container');

  // get the layer's id
  var id = parseInt(e.currentTarget.id.split('_')[2]);

  // get the layer
  var layer = listeLayers.getLayerById(id);

  // get list of attributes
  try {
    var result = layer.data.entities.values[0].properties.propertyNames || layer.data.features[0].properties.propertyNames;
  } catch {
    var result = []
    var obj = layer.data.features[0].properties;
    for(var x in obj){
      result.push(x)
    }
  }

  // add button for each properties
  container.innerHTML = '';
  container.innerHTML += '<button class="attribute_style_button" onclick="setStyleContainer('+id+');">← Retour</button>'
  for(var i = 0; i < result.length ; i++){
    // add button
    container.innerHTML += '<div style="height:7px;"></div>'
    container.innerHTML += '<button class="attribute_style_button" onclick="setLayerColorAttribute('+id+','+"'"+result[i]+"'"+');">'+result[i]+'</button>';
  }
}

/**
 * Function that display the list of geojson attribute in buttons for style
 * 
 * @param {event} e
 * 
 */
 function getListOfAttributes2(id){
  // get container
  var container = document.getElementById('style_container');

  // get the layer
  var layer = listeLayers.getLayerById(id);

  // get list of attributes
  try {
    var result = layer.data.entities.values[0].properties.propertyNames || layer.data.features[0].properties.propertyNames;
  } catch {
    var result = []
    var obj = layer.data.features[0].properties;
    for(var x in obj){
      result.push(x)
    }
  }

  // add button for each properties
  container.innerHTML = '';
  container.innerHTML += '<button class="attribute_style_button" onclick="setStyleContainer('+id+');">← Retour</button>'
  for(var i = 0; i < result.length ; i++){
    // add button
    container.innerHTML += '<div style="height:7px;"></div>'
    container.innerHTML += '<button class="attribute_style_button" onclick="setLayerColorAttribute('+id+','+"'"+result[i]+"'"+');">'+result[i]+'</button>';
  }
}

/**
 * Function that change the color of the different geometry in regard of the selected attribut
 * 
 * @param {int} id
 * @param {string} attribut
 */
function setLayerColorAttribute(id , attribut){
  // get the layer
  var layer = listeLayers.getLayerById(id);

  // go threw all entities
  var used_id = [];
  var stroke = false;
  try{
    var entities = layer.data.entities.values;
  } catch {
    var entities = layer.data.features;
    var entities2 = layer.data.CesiumPolyline;
    stroke = true;
  }
  
  for(var i = 0 ; i < entities.length ; i++){
    // if the old entitie color has not change yet
    if (used_id.indexOf(i) == -1) {
      if (!stroke) {
        var value = entities[i].properties[attribut].getValue();
      } else {
        var value = entities[i].properties[attribut];
      }
      
      var color = Cesium.Color.fromRandom({
        alpha: 0.6
      });
      for(var j = 0 ; j < entities.length - i ; j++){
        if(entities[i+j].properties[attribut] == value){
          // set the color of this entity
          if(!stroke){
            entities[i+j].polygon.material = color;
          } else {
            viewer.entities.getById(entities2[i+j].id).polyline.material = color;
          }
          

          // add this entity to the list
          used_id.push(i+j);
        }
      }
    }
  }
  // Update liste
  listeLayers.update(layer);

  // Reload scene
  viewer.scene.requestRender();

  // load the attribute param style container
  paramStyleAttributes(id , attribut);
}


/**
 * Function that open the page where we can param each color for each attribute
 * 
 * @param {int} id
 * @param {string} attribut
 */
function paramStyleAttributes(id, attribut){
  // get layer
  var layer = listeLayers.getLayerById(id);

  // get container
  var container = document.getElementById('style_container');

  // format container
  container.innerHTML = '';

  // add back button
  container.innerHTML += '<button class="attribute_style_button" onclick="getListOfAttributes2('+id+');">← Retour</button>';
  container.innerHTML += '<div style="height:20px;"></div>';

  // add Legend text
  container.innerHTML += '<h3 style="color:white;font-family:Ubuntu">LEGENDE:</h3>';
  container.innerHTML += '<div style="height:5px;"></div>';

  // add all the solutions
  var stroke = false
  try {
    var entities = layer.data.entities.values;
  } catch {
    var entities = layer.data.features;
    var entities2 = layer.data.CesiumPolyline
    stroke = true;
  }
  
  var list_values_attribute = [];
  var liste_values_entities = [];
  for(var i = 0 ; i < entities.length ; i++){
    // if the values has not already been read
    if (!stroke) {
        var value = entities[i].properties[attribut].getValue();
      } else {
        var value = entities[i].properties[attribut];
      }
    if(list_values_attribute.indexOf(value) == -1){
      // add this value to the list
      list_values_attribute.push(value);
      // add this entity id to the list
      liste_values_entities.push([i])
    } else {
      // add this id in the right row
      liste_values_entities[list_values_attribute.indexOf(value)].push(i);
    }
  }

  // add all the row needed
  for(var i = 0; i < list_values_attribute.length ; i++){
    if (!stroke){
      var c = entities[liste_values_entities[i][0]].polygon.material.getValue().color;
    } else {
      var c = entities2[liste_values_entities[i][0]].polyline.material.getValue().color;
      
    }
    var c = RGBToHex(Math.floor(c.red*255),Math.floor(c.green*255),Math.floor(c.blue*255));
    container.innerHTML += '<div style="height:7px;"></div>';
    container.innerHTML += '<div style="width:100%;display:flex;"><input id="attribute_style_color_'+i+'" type="color" value="'+c+'"></input><div style="width:10px;"></div><h3 style="color:white;font-family: Ubuntu;">'+list_values_attribute[i]+'</h3></div>';
  }
  // add event listener for each color input
  var input = document.querySelectorAll('input');
  for(var i = 0 ; i < input.length ; i++ ){
    input[i].addEventListener('change' , e => {
      var attribute_id = e.currentTarget.id.split('_')[3];
      var c =  hex2rgb(e.currentTarget.value);

      // get entities
      var stroke = false
      try {
        var entities = layer.data.entities.values;
      } catch {
        var entities = layer.data.features;
        var entities2 = layer.data.CesiumPolyline
        stroke = true;
      }

      for(var j = 0 ; j < liste_values_entities[attribute_id].length ; j++){
        if (!stroke) {
          var color = new Cesium.Color(c.r/255,c.g/255,c.b/255,entities[0].polygon.material.getValue().color.alpha);
          entities[liste_values_entities[attribute_id][j]].polygon.material = color;
        } else {
          var color = new Cesium.Color(c.r/255,c.g/255,c.b/255,entities2[0].polyline.material.getValue().color.alpha);
          entities2[liste_values_entities[attribute_id][j]].polyline.material = color;
        }
        
      }
      // Update liste
      listeLayers.update(layer);

      // Reload scene
      viewer.scene.requestRender();

      // load the attribute param style container
      paramStyleAttributes(id, attribut);
    });
  }
}

/**
 * Function that manage the display of an etiquette
 * 
 * @param {event} e
 * 
 */
function manageEtiquette(e){
  // get layer id
  var id = parseInt(e.currentTarget.id.split('_')[2]);

  // get layer
  var layer = listeLayers.getLayerById(id);

  // if there is already an etiquette : destroy it
  if (layer.isLabeled){
    // destroy label
    layer.removeLabel();

    // change title
    e.currentTarget.innerHTML = 'Ajouter une étiquette';

  // if there is no etiquette
  } else {
    // function that load the list of attribute for the etiquette attribute container
    getAttributeForEtiquette(id);

  }
}

/**
 * Function that load the list of attribute for the etiquette container
 * 
 * @param {int} id
 */
function getAttributeForEtiquette(id){
  // get the layer
  var layer = listeLayers.getLayerById(id);

  // get conatiner
  var container = document.getElementById('style_container');

  // add the go back button
  container.innerHTML = '';
  container.innerHTML += '<button class="attribute_style_button" onclick="setStyleContainer('+id+');">← Retour</button>';
  container.innerHTML += '<div style="height:7px;"></div>'

  // add param section
  container.innerHTML += '<h2>Paramètres:</h2>';
  container.innerHTML += '<div style="width:100%;height:1px;background-color:white;"></div>'
  container.innerHTML += '<div style="height:10px;"></div>';

  container.innerHTML += '<div style="width:100%;display:flex;"><h3 style="color:white;font-family:Ubuntu;">Couleur du texte:</h3><div style="width:15px;"></div><input id="etiquette_style_fill" type="color" value="#ffffff" onchange="setStyleApercu();"></div>';
  container.innerHTML += '<div style="height:7px;"></div>';
  container.innerHTML += '<div style="width:100%;display:flex;"><h3 style="color:white;font-family:Ubuntu;">Couleur du fond:</h3><div style="width:15px;"></div><input id="etiquette_style_stroke" type="color" onchange="setStyleApercu();"></div>';
  container.innerHTML += '<div style="height:7px;"></div>';
  container.innerHTML += '<div style="width:100%;display:flex;"><h3 style="color:white;font-family:Ubuntu;">Taille du texte:</h3><div style="width:15px;"></div><input id="etiquette_style_size" type="number" step="1" value="12" min="0" onchange="setStyleApercu();"></div>';
  container.innerHTML += '<div style="height:15px;"></div>';

  // add event for param
  document.getElementById('etiquette_style_fill').addEventListener('change' , setStyleApercu);
  document.getElementById('etiquette_style_stroke').addEventListener('change' , setStyleApercu);
  document.getElementById('etiquette_style_size').addEventListener('change' , setStyleApercu);

  // add apercu section
  container.innerHTML += '<h2>Aperçu:</h2>';
  container.innerHTML += '<div style="width:100%;height:1px;background-color:white;"></div>'
  container.innerHTML += '<div style="height:10px;"></div>';

  container.innerHTML += '<div style="width:100%;height:100px;display:flex;"><div id="apercu_etiquette_fill" style="margin:auto;display:flex;"><p id="apercu_etiquette_stroke" style="font-family:Ubuntu;margin:auto;padding: 4px 8px;">ETIQUETTE</p></div></div>';

  // set style of apercu
  setStyleApercu();

  // add attributs section
  container.innerHTML += '<h2>Attributs:</h2>';
  container.innerHTML += '<div style="width:100%;height:1px;background-color:white;"></div>'
  container.innerHTML += '<div style="height:10px;"></div>';

  // load every attribute
  try {
    var listeAttribut = layer.data.entities.values[0].properties.propertyNames || layer.data.features[0].properties.propertyNames;
  } catch {
    var listeAttribut = []
    var obj = layer.data.features[0].properties;
    for(var x in obj){
      listeAttribut.push(x)
    }
  }

  // load every button
  for (var i = 0 ; i < listeAttribut.length ; i++){
    container.innerHTML += '<button class="attribute_style_button" onclick="getDataEtiquette('+id+' , '+"'"+listeAttribut[i]+"'"+')">'+listeAttribut[i]+'</button>';
    container.innerHTML += '<div style="height:7px;"></div>';
  }

  container.innerHTML += '<div style="height:20px;"></div>';
}

/**
 * Function that get the param of the etiquette and set the etiquette
 * 
 * @param {int} id
 * @param {string} attribut
 */
function getDataEtiquette(id , attribut){
  // get layer
  var layer = listeLayers.getLayerById(id);

  // get fill color
  var fillColor = document.getElementById('etiquette_style_fill').value;
  fillColor = hex2rgb(fillColor);
  fillColor = new Cesium.Color(fillColor.r/255 , fillColor.g/255 , fillColor.b/255 , 1);

  // get stroke color
  var strokeColor = document.getElementById('etiquette_style_stroke').value;
  strokeColor = hex2rgb(strokeColor);
  strokeColor = new Cesium.Color(strokeColor.r/255 , strokeColor.g/255 , strokeColor.b/255 , 1);

  // get font size
  var fontSize = document.getElementById('etiquette_style_size').value;

  // set the layer etiquette
  layer.setLabel(attribut , strokeColor , fillColor , fontSize);

  // load basic style container
  setStyleContainer(id);

  // change the name of the etiquette button
  document.getElementById('etiquette_style_'+id).innerHTML = "Supprimer l'étiquette"
};

/**
 * Function that set the style of the aperçu
 * 
 */
function setStyleApercu(e){
  // get apercu
  var apercuF = document.getElementById('apercu_etiquette_fill');
  var apercuS = document.getElementById('apercu_etiquette_stroke');

  // get fill color
  apercuS.style.webkitTextStroke = "0.5px "+document.getElementById('etiquette_style_fill').value;

  // get stroke color
  apercuS.style.color = document.getElementById('etiquette_style_stroke').value;

  // get font size
  apercuS.style.fontSize = document.getElementById('etiquette_style_size').value + "px";
  
}

/**
 * Function that change the position of a raster
 * 
 * @param {event} e
 */
function changeRasterPosition(e){
  // get type of position
  var type = e.currentTarget.id.split('_')[1];
  // get id of the layer
  var id = parseInt(e.currentTarget.id.split('_')[2]);
  // get layer
  var layer = listeLayers.getLayerById(id);
  // get id imageryProvider
  var imageryId = -1;
  for(var i = 0 ; i < viewer.imageryLayers._layers.length ; i++){
    if(viewer.imageryLayers._layers[i].imageryProvider == layer.data || viewer.imageryLayers._layers[i].imageryProvider == layer.data.imageryProvider){
        imageryId = i;
    }
  }

  if (type == 'first'){
    viewer.imageryLayers.raiseToTop(viewer.imageryLayers.get(imageryId))
  }

  if (type == 'last'){
    viewer.imageryLayers.lowerToBottom(viewer.imageryLayers.get(imageryId))
  }
}

/**
 * Function that change the lumix of a 3dtiles layer
 * 
 * @param {event} e
 */
function change3DTilesLayerOpacity(e){
  // get id of the layer
  var id = parseInt(e.currentTarget.id.split('_')[2]);
    
  // get layer
  var layer = listeLayers.getLayerById(id);

  //set opacity
  var l = e.currentTarget.value/100;


  // Update liste
  listeLayers.update(layer);

  // Reload scene
  viewer.scene.requestRender();
}