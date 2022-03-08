function LayersGroup (){
    // attribute constructor
    this.layers = [];

    // METHOD
    // Add layer to group
    this.add = function( lyr ){
        this.layers.push(lyr);
    }

    // Get all the categorie of layers
    this.getAllGroup = function(){
        var groups = [];
        var n = this.layers.length;
        for(var i = 0 ; i < n ; i++){
            if(groups.indexOf(this.layers[i].group) == -1){
                groups.push(this.layers[i].group)
            }
        }
        return groups;
    }

    // Get a layers by it id
    this.getLayerById = function(id){
        var n = this.layers.length;
        for(var i = 0 ; i < n ; i++){
            if (this.layers[i].id == id){
                return this.layers[i];
            }
        }
    }

    // get layers by groups
    this.getLayersByGroup = function(group_name){
        var n = this.layers.length;
        var liste_to_return = [];
        for(var i = 0; i < n ; i++){
            if(this.layers[i].group == group_name){
                liste_to_return.push(this.layers[i]);
            }
        }
        return liste_to_return;
    }

    // update one layer of the list
    this.update = function(layer){
        var id = this.layers.indexOf(this.getLayerById(layer.id));
        if (id != -1){
            this.layers[id] = layer;
        }
    }



}








function Val3DLayer (cfg){
    // Attribute Constructor
    this.id = parseInt(cfg['ID']);
    this.nom = cfg['Name'];
    this.path = cfg['Path'].replace(/\\/gi,'/' );
    this.type = cfg['Type'];
    this.default_display = cfg['Display'];
    this.group = cfg['Groupe'];
    this.access = true;
    if(cfg['Access'] == "NONE;"){
        this.access = false;
    }
    if(cfg['Meta'] == ''){
        this.meta = {};
    } else {
        this.meta = JSON.parse(cfg['Meta']);
    }
    this.data;

    // Other Attribute
    this.isDisplay = false;
    this.isLabeled = false;
    this.labels;
    this.ImageryLayerID;
    this.lumix;


    // Methode
    /**
     * Function that add the layer to the cesium viewer
     * 
     */
    this.construct = function(){
        // 3D TILES
        if (this.type == '3dtiles'){
            this.data = new Cesium.Cesium3DTileset({
                url: this.path,
                maximumScreenSpaceError : 1,
                maximumNumberOfLoadedTiles : 1000,
                lightColor : new Cesium.Cartesian3(3,2.8,2.4),
                imageBasedLightingFactor : new Cesium.Cartesian2(2,2),
                luminanceAtZenith : 0.5,
                immediatelyLoadDesiredLevelOfDetail : false,
                foveatedConeSize : 0.5,
                skipLevelOfDetail: true
            });
            viewer.scene.primitives.add(this.data);
            // Update liste
            listeLayers.update(this);
            // Reload scene
            viewer.scene.requestRender();
        }

        // GeoJson Surface
        if (this.type == 'vectS'){
            var thisLayer = this;
            Cesium.GeoJsonDataSource.load(this.path , {
                clampToGround: true,
            }).then(function(geojson){
                var p = geojson.entities.values;
                // for (var i = 0; i < p.length; i++) {
                //     p[i].polygon.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
                // }
                thisLayer.data = geojson;
                viewer.dataSources.add(geojson);
                // Set default style
                thisLayer.setDefaultStyle();
                // Update liste
                listeLayers.update(thisLayer);
                // Reload scene
                viewer.scene.requestRender();
                })
        }

        // GeoJson PolyLine
        if(this.type == 'vectC'){
            var thisLayer = this;
            fetch(this.path).then(a => a.json()).then(a => {
                a.CesiumPolyline = [];
                for(var i = 0 ; i < a.features.length ; i++){
                    // transform the positions in an array of cesium cartesian 3
                    new_geom = []
                    a.features[i].geometry.coordinates[0].forEach(p => {
                        new_geom.push(p[0])
                        new_geom.push(p[1])
                    })
                    // create a polyline
                    var poly = {
                        positions: Cesium.Cartesian3.fromDegreesArray(new_geom),
                        width: 4,
                        show: true,
                        clampToGround : true
                    }
                    // add it to the viewer
                    var poly2 = viewer.entities.add({
                        polyline : poly
                    });
                    // add it to the geojson
                    a.CesiumPolyline.push(poly2)
                }
                // set the val3d object
                thisLayer.data = a;
                // Set default style
                thisLayer.setDefaultStyle();
                // Update liste
                listeLayers.update(thisLayer)
                // Reload scene
                viewer.scene.requestRender();
            })

        }

        // Geojson line
        if (this.type == "vectL") {
            var thisLayer = this;
            fetch(this.path).then(a => a.json()).then(a => {
                a.CesiumPolyline = [];
                for (var i = 0 ; i < a.features.length ; i++){
                    var newgeom = [];
                    a.features[i].geometry.coordinates.forEach(p => {
                        newgeom.push(p[0]);
                        newgeom.push(p[1]);
                    });
                    // create a polyline
                    var poly = {
                        positions: Cesium.Cartesian3.fromDegreesArray(newgeom),
                        width: 4,
                        show: true,
                        clampToGround : true
                    }
                    var poly2 = viewer.entities.add({
                        polyline : poly
                    });
                    // add it to the geojson
                    a.CesiumPolyline.push(poly2);
                }
                // set the val3d object
                thisLayer.data = a;
                // Set default style
                thisLayer.setDefaultStyle();
                // Update liste
                listeLayers.update(thisLayer)
                // Reload scene
                viewer.scene.requestRender();
            });
        }
        
        //GeoJson Volume
        if (this.type == 'vectV'){
            var thisLayer = this;
            Cesium.GeoJsonDataSource.load(this.path , {
                clampToGround: true,
            }).then(function(geojson){
                var p = geojson.entities.values;
                for (var i = 0; i < p.length; i++) {
                    p[i].polygon.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
                    p[i].polygon.extrudedHeightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
                    p[i].polygon.extrudedHeight = p[i].properties.HAUTEUR; // or height property
                }
                thisLayer.data = geojson;
                viewer.dataSources.add(geojson);
                // Set default style
                thisLayer.setDefaultStyle();
                // Update liste
                listeLayers.update(thisLayer);
                // Reload scene
                viewer.scene.requestRender();
                })
        }

        // OpenStreetMap Imagery
        if (this.type == 'imageryOsm'){
            console.log("OSM Imagery");
            // IMAGERY
            this.data = new Cesium.TileMapServiceImageryProvider({
                url: 'https://a.tile.openstreetmap.org/',
                fileExtension: 'png'
            });
            // Update liste
            listeLayers.update(this);
            // Reload scene
            viewer.scene.requestRender();
            // nbImageryDisplayed
            nbImageryDisplayed += 1;
        }

        // Geoportail Imagery
        if (this.type == 'imageryGeoP'){
            // IMAGERY
            this.data = new Cesium.WebMapTileServiceImageryProvider({
                url : this.path,
                layer : this.meta.WMTS.layer,
                style : this.meta.WMTS.style || 'normal',
                format : this.meta.WMTS.format || 'image/png',
                tileMatrixSetID : this.meta.WMTS.tileMatrixSetID || 'PM'
            });
            viewer.imageryLayers.addImageryProvider(this.data);
            // Update liste
            listeLayers.update(this);
            // Reload scene
            viewer.scene.requestRender();

        }

        // Geoservice VDM
        if (this.type == 'imageryVdm'){
            // IMAGERY
            this.data = new Cesium.WebMapServiceImageryProvider({
                url : this.path,
                layers : this.meta.WMS.layer || 'CASSINI3',
                crs: 'EPSG:3857',
                srs: 'EPSG:3857',
                tileMatrixSetID: 'CASSINI3-wmsc-10',
                parameters: {
                    format: this.meta.WMS.format || 'image/jpeg',
                    request: this.meta.WMS.request || 'GetTile',
                    styles: this.meta.WMS.style || "",
                    version: this.meta.WMS.version || "1.1.1"
                }
            });
            console.log(this.data)
            // Update liste
            listeLayers.update(this);
            // Reload scene
            viewer.scene.requestRender();
        }

        // Buildings OSM
        if(this.type == 'buildingOSM'){
            this.data = Cesium.createOsmBuildings()
            viewer.scene.primitives.add(this.data);
            // Update list
            listeLayers.update(this);
            // Reload scene
            viewer.scene.requestRender();
        }

        // Skybox
        if(this.type == 'skybox'){
            viewer.skyBox = true;
            viewer.scene.skyBox = new Cesium.SkyBox({
                sources : {
                  positiveX : this.path,
                  negativeX : this.path,
                  positiveY : this.path,
                  negativeY : this.path,
                  positiveZ : this.path,
                  negativeZ : this.path
                }
            });
            this.data = viewer.scene.skyBox;
            // Update list
            listeLayers.update(this);
            // Reload scene
            viewer.scene.requestRender();

        }


        // IsDisplay -> true
        this.isDisplay = true;

    }

    /**
     * Function that remove the layer of the map
     * 
     */
    this.destroy = function(){
        // if the layer isnot display -> quit destroy()
        if(!this.isDisplay){
            return
        }
        // 3D TILES
        if (this.type == '3dtiles'){
            this.data.destroy();
        }

        // GEOJSON surface
        if (this.type == 'vectS'){
            viewer.dataSources.remove(this.data);
            this.data = undefined;
        }

        // GEOJSON Volume
        if (this.type == 'vectV'){
            viewer.dataSources.remove(this.data);
            this.data = undefined;
        }

        // GEOJSON line
        if(this.type == 'vectC'){
            for(var i = 0 ; i < this.data.CesiumPolyline.length ; i++){
                viewer.entities.remove(this.data.CesiumPolyline[i]);
            }
            this.data = undefined;
        }

        // GEOJSON line
        if(this.type == 'vectL'){
            for(var i = 0 ; i < this.data.CesiumPolyline.length ; i++){
                viewer.entities.remove(this.data.CesiumPolyline[i]);
            }
            this.data = undefined;
        }

        // OpenStreetMap Imagery
        if (this.type == 'imageryOsm'){
            // IMAGERY
            viewer.imageryLayers.destroy(this.data , true);
            this.data = undefined;
        }

        // geoportail imagery
        if (this.type == 'imageryGeoP'){
            // get imagery provider id
            var imageryId = -1;
            for(var i = 0 ; i < viewer.imageryLayers._layers.length ; i++){
                if(viewer.imageryLayers._layers[i].imageryProvider == this.data){
                    imageryId = i;
                }
            }
            if(imageryId != -1){
                // IMAGERY
                viewer.imageryLayers.remove(viewer.imageryLayers.get(imageryId) , false);
            }            
        }

        // Buildings OSM
        if(this.type == 'buildingOSM'){
            this.data.destroy();
        }

        // skybox
        if (this.type == 'skybox') {
            viewer.skyBox = false
            this.data = undefined;
            viewer.scene.skyBox.destroy();
        }

        // IsDisplay -> false
        this.isDisplay = false;

        // Update liste
        listeLayers.update(this);

        // Reload scene
        viewer.scene.requestRender();
        
    }


    /**
     * Function to get the color of the layer if it is a vect
     * 
     */
    this.getColor = function(){
        // if it is a surface layer
        if(this.type == 'vectS' || this.type == 'vectV'){
            console.log(this.data.entities);
            return this.data.entities.values[0].polygon.material.color._value || {red:0,green:0,blue:0,alpha:1};
        }

        // if it s a polyline layer
        if(this.type == ('vectC')){
            return viewer.entities.getById(this.data.CesiumPolyline[0].id).polyline.material.color._value || {red:0,green:0,blue:0,alpha:1};
        }

        // if it s a polyline layer
        if(this.type == ('vectL')){
            return viewer.entities.getById(this.data.CesiumPolyline[0].id).polyline.material.color._value || {red:0,green:0,blue:0,alpha:1};
        }

        // if not
        return false;
    }

    /**
     * Function that set the default style of the layer
     * 
     */
     this.setDefaultStyle = function(){
        // if the layer have a default style
        if(this.meta != {}){
            //3DTILES
            if (this.type == '3dtiles'){
                var l = this.meta.style.lumix
                if(l < 0 || l > 1 || l == undefined){
                    l = 0.5
                }
                this.lumix =  l;  
            } else {
                //RASTER
                // if it has a unique style
                if (this.meta.style.type == 'uniq'){  

                    if(this.type.split('S').length >= 2 || this.type.split('V') >= 2){
                        // define fill color
                        var c =  this.meta.style.fill_color || {red: 255, green: 0, blue: 0, alpha: 0.5}
                        var fillcolor = new Cesium.Color(c.red/255, c.green/255, c.blue/255, c.alpha);

                        // set fill color
                        for (var i = 0 ; i < this.data.entities.values.length ; i++){
                            this.data.entities.values[i].polygon.material = fillcolor;
                        }
                    }
                    
                    if (this.type.split('C').length >= 2){
                        // define stroke color
                        var c = this.meta.style.stroke_color || {red: 0, green: 0, blue: 0};
                        var strokecolor = new Cesium.Color(c.red/255, c.green/255, c.blue/255, 1);

                        // define stroke width
                        var width = this.meta.style.stroke_width || 2;

                        // set stroke param
                        for (var i = 0 ; i < this.data.CesiumPolyline.length ; i++){
                            var p = viewer.entities.getById(this.data.CesiumPolyline[i].id).polyline;
                            p.material = strokecolor;
                            p.width = width;
                        }
                    }

                    if (this.type.split('L').length >= 2){
                        // define stroke color
                        var c = this.meta.style.stroke_color || {red: 0, green: 0, blue: 0};
                        var strokecolor = new Cesium.Color(c.red/255, c.green/255, c.blue/255, 1);

                        // define stroke width
                        var width = this.meta.style.stroke_width || 2;

                        // set stroke param
                        for (var i = 0 ; i < this.data.CesiumPolyline.length ; i++){
                            var p = viewer.entities.getById(this.data.CesiumPolyline[i].id).polyline;
                            p.material = strokecolor;
                            p.width = width;
                        }
                    }

                    
                    

                } else {
                    if(this.meta.type == 'attribut'){
                        // put random color depending on attribute
                        setLayerColorAttribute(this.id , this.meta.style.attribut);
                    }
                }
            }
        } else {
            console.log('JSON not load');
        }
    }

    /**
     * Function that display an etiquette of this layer
     * 
     * @param {string} attribute
     * @param {string} fontColor
     * @param {string} fillColor
     * @param {int} fontSize
     */
    this.setLabel = function(attribute , fontColor, fillColor , fontSize){
        // set a vector height to display text heighter
        var hauteur = 200;
        var bary = Cesium.Cartesian3.fromDegrees(2.454352 , 48.788833 , 0);
        var dist = Math.sqrt(bary.x*bary.x + bary.y*bary.y + bary.z * bary.z);
        var vect = {
            x: bary.x * hauteur/dist,
            y: bary.y * hauteur/dist,
            z: bary.z * hauteur/dist
        }

        if (this.type != 'vectC' && this.type != "vectL"){
            var entities = this.data.entities.values;
            for (var i = 0; i < entities.length ; i++){
                var positions = entities[i].polygon.hierarchy['_value'].positions;
                var center = Cesium.BoundingSphere.fromPoints(positions).center;
                center = new Cesium.Cartesian3(center.x + vect.x, center.y + vect.y, center.z + vect.z);
                entities[i].position = new Cesium.ConstantPositionProperty(center)
                entities[i].label = new Cesium.LabelGraphics({
                    text: entities[i].properties[attribute].getValue(),
                    font: fontSize+"px Ubuntu",
                    fillColor: fontColor,
                    outlineWidth : 3,
                    outlineColor: fillColor,
                    style : Cesium.LabelStyle.FILL_AND_OUTLINE,
                    verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset : new Cesium.Cartesian2(0, 0),
                    show: true,
                    heigthReference: Cesium.HeightReference.NONE
                });
            }
        } else {
            var entities = this.data.features;
            var entities2 = this.data.CesiumPolyline;
            for (var i = 0; i < entities.length ; i++){
                var positions = entities2[i].polyline.positions.getValue();
                var center = Cesium.BoundingSphere.fromPoints(positions).center;
                center = new Cesium.Cartesian3(center.x + vect.x, center.y + vect.y, center.z + vect.z);
                entities2[i].position = new Cesium.ConstantPositionProperty(center)
                entities2[i].label = new Cesium.LabelGraphics({
                    text: entities[i].properties[attribute],
                    font: fontSize+"px Ubuntu",
                    fillColor: fontColor,
                    outlineWidth : 3,
                    outlineColor: fillColor,
                    style : Cesium.LabelStyle.FILL_AND_OUTLINE,
                    verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset : new Cesium.Cartesian2(0, 0),
                    show: true,
                    heigthReference: Cesium.HeightReference.NONE
                });
            }
        }
        
        
        // change status of the layer
        this.isLabeled = true;

        // update liste
        listeLayers.update(this);

        // reload viewer
        viewer.scene.requestRender();
    }

    /**
     * Function that delete the label of the layer
     * 
     */
    this.removeLabel = function(){
        // remove labels
        if(this.type != 'vectC' && this.type != 'vectL'){
            var entities = this.data.entities.values;
        } else {
            var entities = this.data.CesiumPolyline;
        }
        
        for(var i = 0 ; i < entities.length ; i++){
            entities[i].label = undefined;
        }

        // change status of the layer
        this.isLabeled = false;

        // update liste
        listeLayers.update(this);

        // reload viewer
        viewer.scene.requestRender();

    }


    /**
     * Function that return the opacity of a layer
     * 
     */
    this.getOpacity = function(){
        if (this.type.split('imagery').length == 2){
            if (this.type == 'imageryIon'){
                return this.data.alpha;
            } else {
                // get imagery provider id
                var imageryId = -1;
                for(var i = 0 ; i < viewer.imageryLayers._layers.length ; i++){
                    if(viewer.imageryLayers._layers[i].imageryProvider == this.data){
                        imageryId = i;
                    }
                }

                // return alpha
                return viewer.imageryLayers._layers[imageryId].alpha;
            }
        }
        
        if (this.type.split('vect').length == 2){
            return this.data.alpha;
        }
    }
    
}