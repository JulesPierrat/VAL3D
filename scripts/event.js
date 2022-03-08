/**
 * Function when the client click on the cesium canvas
 * 
 * @param {event} e Click event on the cesium Canvas
 */
function clickOnCesiumCanvas(e){
    // get the position of the click
    var clickPosition = new Cesium.Cartesian2(e.offsetX , e.offsetY);

    // get the element pick
    try{
        var clickedObject = viewer.scene.pick(clickPosition).primitive;
        
    } catch {
        return undefined;
    }

    // if it have an event
    if(clickedObject.id != undefined){
        // get the information about the event
        var info = clickedObject.id.split('_');

        // if it is a POI
        if(info[0] == 'POI'){
            getPOIInfo(parseInt(info[1]) , parseInt(info[2]));
        }
    }
}

