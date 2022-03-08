function POIGroup(){
    // attribute constructor
    this.data = [];

    // METHOD

    /**
     * Function that return a layers of POI by it id
     * 
     *@param {int} id 
     */
    this.getLayerById = function(id){
        for(var i = 0 ; i < this.data.length ; i++){
            if (this.data[i].id == id){
                return this.data[i];
            }
        }
        return false;

    }

    /**
     * Function that let you add a new new layer of POI
     * 
     * @param {POILayer} PoiLayer
     */
    this.addPOILayer = function(PoiLayer){
        this.data.push(PoiLayer);
    }

    /**
     * Function that update a layer of POI in the liste
     * 
     * @param {POILayer} PoiLayer
     */
    this.update = function(PoiLayer){
        for(var i = 0 ; i < this.data.length ; i++){
            if(this.data[i].name == PoiLayer.name){
                this.data[i] = PoiLayer;
                break;
            }
        }
    }
}

function POILayer(cfg){
    // attribute constructor
    this.id = cfg.id || 0;
    this.data = viewer.scene.primitives.add(new Cesium.BillboardCollection());
    this.name = cfg.name;
    this.meta = {};
    this.path = cfg.path || undefined;
    this.json_data = {};
    this.displayed = false;
    // get meta
    if (cfg.meta != undefined){
        this.meta = JSON.parse(cfg.meta);
    }

    // METHOD

    /**
     * Function that return a billboard in this billboardCollection by it ID
     * 
     * @param {int} ID
     * @return {BillBoard} Cesium object BillBoard
     */
    this.getPoiById = function(ID){
        for (var i = 0; i < this.data.length ; i++){
            if(this.data.get(i).ID == ID){
                return this.data.get(i);
            }
        }
        return false;
    }


    /**
     * Function that add all the Poi of this layer to the viewer
     * 
     */
    this.drawAllPoi = function(){
        // we get the json data
        if (this.path != undefined){
            fetch(this.path+'/data.json').then(a => a.json()).then(a => {
                this.json_data =  a.features;
                // we read every point
                for(var i = 0; i < this.json_data.length ; i++){
                    try{
                        this.data.add({
                            id: 'POI_'+ this.id + '_' + i,
                            position : new Cesium.Cartesian3.fromDegrees(this.json_data[i].geometry.coordinates[0], this.json_data[i].geometry.coordinates[1], this.meta.height || this.meta.height_field || 200),
                            eyeOffset : new Cesium.Cartesian3(0.0,0.0,-100.0), // Negative Z will make it closer to the camera
                            image : this.meta.style.image || this.meta.style.image_field || 'media/img/geocoder_marker.png',
                            scale : this.meta.style.image_scale || 0.05,
                            verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                            heightReference : Cesium.HeightReference.NONE
                        });
                        this.data.get(i).ID = i;
                    } catch {};
                
                }

                // set the displayed value
                this.displayed = true;

                // update view
                viewer.scene.requestRender();

            })
        }

    }

    /**
     * Function that remove this layer of poi
     * 
     */
    this.remove = function(){
        // destroy billboard collection
        this.data.removeAll();

        // set the display variable to false
        this.displayed = false;

        // render scene
        viewer.scene.requestRender();
    }


}