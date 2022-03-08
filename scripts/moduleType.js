/// replace NAME by the module name

// VARIABLES YOU CAN ACCESS
// viewer → Cesium viewer
// listeLayers → liste des couches
// listePOIs → liste des POIs
// listeBIMs → liste des projets BIM
// listeMeasure → liste des mesures

// FUNCTION THAT YOU V+CAN ACCESS
// HideMenu() → Close the opened menu

/**
 * Function that load the NAME module in VAL3D
 */
 function openNameMenu(){ // Replace Name by your module code bim -> Bim, layers -> Layers
	// Si une autre page est ouverte
	if (window.OPENED_MENU != 'null'){
		hideMenu();
	}

	// We change is event on click
	document.getElementById('menus_button_name').setAttribute("onclick" , undefined); // replace name by code module
	document.getElementById('menus_button_name').addEventListener('click' , hideMenu); // replace name by code module

	// We display the div menu
	document.getElementById('menu').style.width = '350px';

	// We change the BG color of the button
	document.getElementById('menus_button_name').style.backgroundColor = 'rgba(180,180,180,1)'; // replace name by code module

	// We change the title
	document.getElementById('menu_container_title').innerHTML = 'MENU NAME'; // replace NAME by name module in MAJ

	// We add the layers option div
	document.getElementById('div_name_menu').style.display = 'block'; //replace name by code module


    // We add content to BIM Menu
    // replace name by code module (x3)
    document.getElementById('div_name_menu').innerHTML = "<div id='div_name_menu' style='display:none;width:100%;height:100%'><div style='width:100%;height:auto;display:flex;overflow:auto;'><div style='width:20px;'></div><div id='container_name_menu' style='width:100%;height:auto;overflow:auto;'></div><div style='width:20px;'></div></div></div>";

	// We set the variable Opened Menu
	window.OPENED_MENU = 'Name'; // replace Name by code module with a maj start

    // Call one of your fonction under
    

}



// THEN YOU CAN DO WHAT YOU WANT (only function)