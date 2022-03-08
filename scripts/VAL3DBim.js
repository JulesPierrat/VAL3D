function BimGroup(){
    this.maquettes = [];

    // METHOD
    /**
     * Function that add a Bim Project to the group
     * 
     * @param {BimProject} project;
     */
    this.add = function(project){
        this.maquettes.push(project);
    }

    /**
     * Function that return a Bim Project by giving it id
     * 
     * @param {int} id id of the bim project to return;
     * @return {BimProject}
     */
    this.getProjectById = function(id){
        for(var i =0 ; i < this.maquettes.length ; i++){
            if(this.maquettes[i].id == id){
                return this.maquettes[i];
            }
        }
    }

    /**
     * Function that update a Biim project in the liste
     * 
     * @param {BimProject} project Bim Project to update;
     */
    this.update = function(project){
        for(var i =0 ; i < this.maquettes.length ; i++){
            if(this.maquettes[i].id == project.id){
                this.maquettes[i] = project;
                return;
            }
        }
    }
}



function BimProject(cfg){
    // ATTRIBUTE
    this.id = cfg.id;
    this.name = cfg.name || 'Sans Titre';
    this.description = cfg.description || 'Sans description';
    this.path = cfg.path || '';
    this.display = false;
    this.fixedFrame;
    this.model;
    this.position;


    // METHOD
    /**
     * Display a BIM Project on viewer
     * 
     */
    this.construct = function(){
        fetch(this.path + '/meta.json').then(a => a.json()).then(param => {
            this.fixedFrame = new Cesium.Transforms.eastNorthUpToFixedFrame(new Cesium.Cartesian3.fromDegrees(param.longitude, param.latitude, param.height));
            var translation = new Cesium.Cartesian3(0,0,0);
            var scale = new Cesium.Cartesian3(1,1,1);
            var axis = new Cesium.Cartesian3(0,0,1);
            var rotation = new Cesium.Quaternion.fromAxisAngle(axis, param.rotation/180*Math.PI);
            var matrix = new Cesium.Matrix4.fromTranslationQuaternionRotationScale(translation, rotation, scale);

            this.fixedFrame = Cesium.Matrix4.multiply(this.fixedFrame , matrix , new Cesium.Matrix4);

            this.model = viewer.scene.primitives.add(Cesium.Model.fromGltf({
                url : this.path +'/maquette.gltf',
                modelMatrix : this.fixedFrame,
                scale : param.scale
            }));

            // save position
            this.position = new Cesium.Cartesian3.fromDegrees(param.longitude, param.latitude, param.height);

            //set display
            this.display = true;

            // Update liste
            listeBIMs.update(this);

            // Add clipping plane
            if(param.envelop.length != 0){
                let planes = [];
                for (let i = 0 ; i < param.envelop.length - 1 ; i++ ) {
                    // Get the two extremity of each segments
                    let pointA = new Cesium.Cartesian3.fromDegrees(param.envelop[i][0], param.envelop[i][1]);
                    let pointB = new Cesium.Cartesian3.fromDegrees(param.envelop[i+1][0], param.envelop[i+1][1]);

                    console.log(pointA);
                    console.log(pointB);


                    // Get the vect AB normanlize
                    let ABvect = new Cesium.Cartesian3();
                    Cesium.Cartesian3.subtract(pointA, pointB, ABvect);

                    // Get the Zenith vector
                    let AzenithVect = viewer.scene.globe.ellipsoid.geodeticSurfaceNormal(pointA);

                    // Calc normal
                    let normal = new Cesium.Cartesian3();
                    Cesium.Cartesian3.dot(ABvect, AzenithVect, normal);
                    Cesium.Cartesian3.normalize(normal, normal);

                    // Create plane
                    let plane = new Cesium.Plane.fromPointNormal(pointA, normal);
                    plane.distance = 0;
                    planes.push(plane);

                }

                // Convert to clipping planes
                let clipping_planes = [];
                planes.forEach(p => {
                    clipping_planes.push(new Cesium.ClippingPlane.fromPlane(p));
                });

                let clippingPlanes = new Cesium.ClippingPlaneCollection({
                    planes: clipping_planes,
                    unionClippingRegions: false,
                    edgeWidth: 1
                });

                // Add it to the model
                listeLayers.getLayerById(1).data.clippingPlanes = clippingPlanes;
                console.log(viewer);
                console.log(listeLayers);
            }

            // Reload scene
            viewer.scene.requestRender();

            // Move camera
            this.flyTo();

           
        });
    }

    /**
     * Function that destroy a Bim project
     * 
     */
    this.destroy = function(){
        // remove model
        this.model.destroy();

        // delete fixed frame
        this.fixedFrame = undefined;

        // set display
        this.display = false

        // Update liste
        listeBIMs.update(this);

        // Reload scene
        viewer.scene.requestRender();
    }

    /**
     * Function that let you fly to a BIM place
     * 
     * @param {BimProject} project Bim project we fly to;
     */
    this.flyTo = function(){
        // get coords
        var coords = this.position;

        // transform in Lon, Lat, height
        coords = Cesium.Cartographic.fromCartesian(coords);
        // add 300m height and 300m south
        coords.height += flyToPOIDistance*100;
        coords.latitude -= flyToPOIDistance*100*coords.latitude/RAYON_TERRE;
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

}

