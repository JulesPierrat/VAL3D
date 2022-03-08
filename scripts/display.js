/**
* Function sleep
*
*
**/
function pausecomp(millis){
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}


/**
*Function that destroy the loading page
**/
function destroyLoadingPage(){
  setTimeout(() => {
  	document.getElementById('loadingPage').style.opacity = '0';
    setTimeout(() => {document.getElementById('loadingPage').style.display = 'none';
    } ,2000);
   }, 3000);
}

/**
*Function that display the loading page
**/
function displayLoadingPage(){
	document.getElementById('loadingPage').style.display = 'flex';
	document.getElementById('loadingPage').style.opacity = '100';
}

/**
*Function that create all event for each button in page
**/
function activeAllButtons(){

	// INIT VARIABLE
	window.OPENED_MENU = 'null';
	window.ALL_LAYERS_VISIBLE_IN_MENU = 'true';


	// PULL BAR MENU
	document.getElementById('menu_touchbar').addEventListener('mousedown',pullBar);

	

}

/**
* function that hide and clean the menu
**/
function hideMenu(){

	// We put the new interaction in place
	var exMenu = window.OPENED_MENU;
	try {
		// Event listener
		document.getElementById("div_"+exMenu.toLowerCase()+"_menu").removeEventListener('click' , hideMenu);
		document.getElementById('menus').innerHTML = menusHTML; // refresh Menus

		// Change color of button
		document.getElementById("div_"+exMenu.toLowerCase()+"_menu").style.backgroundColor = 'rgba(100,100,100,0)';

		// Undisplay the old menu
		document.getElementById("div_"+exMenu.toLowerCase()+"_menu").style.display = 'none';
	} catch {}

	// We initiate the openedmenu value
	window.OPENED_MENU = 'null';

	// We close the menu
	document.getElementById('menu').style.width = '0px';

}

/**
* Function that let you pull the width of the menu
*
*@param {event} e
*
**/
function pullBar(e){

	document.getElementById('menu').style.transition = '0s';

	var maxWidth = document.getElementById('cesiumContainer').clientWidth;
	if (maxWidth > 700){
		maxWidth = 700;
	}

	var width = document.getElementById('menu').clientWidth;
	var initX = e.screenX;
	var isResizing = true;

	var mousemove = function(e){
		var dx = width + (e.screenX - initX)
		if (dx>5 && dx<maxWidth){
			document.getElementById('menu').style.width = dx + 'px';
		}
		if (dx <= 5){
			window.removeEventListener('mousemove' , mousemove);
			window.removeEventListener('mouseup' , mouseup);
			document.getElementById('menu').style.transition = '0.5s';
			hideMenu();
		}
	};
	var mouseup = function(e){
		window.removeEventListener('mousemove' , mousemove);
		window.removeEventListener('mouseup' , mouseup);
		document.getElementById('menu').style.transition = '0.5s';

	}
	window.addEventListener('mousemove', mousemove);
	window.addEventListener('mouseup', mouseup);
}







