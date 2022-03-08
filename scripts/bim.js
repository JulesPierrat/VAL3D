/**
*Function that open the BIM menu
**/
function openBimMenu(){
	// Si une autre page est ouverte
	if (window.OPENED_MENU != 'null'){
		hideMenu();
	}

	// We change is event on click
	document.getElementById('menus_button_bim').setAttribute("onclick" , undefined);
	document.getElementById('menus_button_bim').addEventListener('click' , hideMenu);

	// We display the div menu
	document.getElementById('menu').style.width = '600px';

	// We change the BG color of the button
	document.getElementById('menus_button_bim').style.backgroundColor = 'rgba(180,180,180,1)';

	// We change the title
	document.getElementById('menu_container_title').innerHTML = 'MENU PROJET BIM';

	// We add the layers option div
	document.getElementById('div_bim_menu').style.display = 'block';


    // We add content to BIM Menu
    document.getElementById('div_bim_menu').innerHTML = "<div id='div_bim_menu' style='display:block;width:100%;height:100%'><div style='width:100%;height:auto;display:flex;overflow:auto;'><div style='width:20px;'></div><div id='container_bim_menu' style='width:100%;height:auto;overflow:auto;'></div><div style='width:20px;'></div></div></div>";

	// We set the variable Opened Menu
	window.OPENED_MENU = 'Bim';

	// Get all of the bim project
	DisplayBimProject();

}


/**
 * Function that load all the Bim Project in the viewer
 * 
 */
 function loadBimProject(){
	

	// get liste of bim
	fetch('php/getBimProject.php').then(a => a.json()).then(a => {
		var n = a.length;
		for(var i = 0; i < n; i++){
			// add Bim broject to the list
			var bimProject = new BimProject({
				id: parseInt(a[i].Id),
				name: a[i].Name,
				description: a[i].Description,
				path: a[i].Path
			});
			listeBIMs.add(bimProject);
		}
	});
}

/**
 * Function that display the Bim project in the menu
 * 
 */
function DisplayBimProject(){
	// get liste of bim project
	var liste = listeBIMs.maquettes;

	// get container & set hml
	var container = document.getElementById('container_bim_menu');
	var html = '';

	// for each poject
	liste.forEach(p => {
		html += '<button id="bim_container_'+p.id+'" class="bim_container" onclick="AddProjectToViewer('+p.id+');">';
		html += '	<div class="bim_container_img"><img src="'+p.path+'/img.jpg" width="100%"></div>';
		html += '	<div style="height:100%;overflow:auto;box-sizing:border-box;padding:7px;white-space: nowrap;overflow: hidden;text-align:left;">';
		html += '		<h3 style="color:white;font-family:Ubuntu;text-overflow: ellipsis;">'+p.name+'</h3>';
		html += '		<div style="height:5px;"></div>';
		p.description.split('\n').forEach(l => {
			html += '		<p style="color:#B4B4B4">'+l+'</p>';
		});
		html += '	</div>'
		html += '</button>';
	});

	container.innerHTML = html;

	// if a bim project is displayed we change background
	liste.forEach(p => {
		if(p.display){
			document.getElementById('bim_container_'+p.id).style.backgroundColor = "#009EDF"
		}
	})
}


/**
 * Function that add a bim project to the viewer
 * 
 * @param {int} id Id of the bim project
 */
function AddProjectToViewer(id){
	// get the project
	var project = listeBIMs.getProjectById(id);

	// if the project is already displayed
	if(project.display){
		// we destroy project
		project.destroy();

		// we reload display in menu
		DisplayBimProject();

	} else {
		// we construct the project
		project.construct();

		// we hide the menu
		hideMenu();
	}
}
