/**
* Function to init the Page Val3D
**/
function initPage(){
  // Your access token can be found at: https://cesium.com/ion/tokens.
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4MDBlYzgwNS01MTFjLTRlZDEtOTNiNy1lNDg5YTczYTM3NTIiLCJpZCI6NTc2MDAsImlhdCI6MTYyMjQ3MjY0OX0.7nyy01buKDk68n2YiaWGaCdYaRcnnyG9Z1ecFWG1sJY';
  // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
  viewer = new Cesium.Viewer('cesiumContainer', {
    // Ellipsoid
    //terrainProvider: new Cesium.EllipsoidTerrainProvider(),
    //Use OpenStreetMaps
    //imageryProvider : new Cesium.IonImageryProvider({ assetId: 485123 }),
    // Hide the base layer picker
    baseLayerPicker : false,
    // Hide the animation button
    animation : false,
    // Hide full screen button
    fullscreenButton : false,
    // Hide geocoder button
    geocoder : false,
    // Hide home button
    homeButton : false,
    // Hide info box button
    infoBox : false,
    // Hide scene mode picker
    sceneModePicker: false,
    // Hide selction indicator
    selectionIndicator: false,
    // Hide timeline
    timeline: false,
    // Hide navigation help button
    navigationHelpButton: false,
    navigationInstructionsInitiallyVisible: false,
    // Color params
    requestRenderMode : true, // amélioration de performance: l'appli calcule uniquement quand on lui demande (https://cesium.com/blog/2018/01/24/cesium-scene-rendering-performance/)
    maximumRenderTimeChange : Infinity,
    gamma : 5,
    highDynamicRange : true,
    // No skybox
    skyBox: false,
  });

  // TERRAIN
  viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
  viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
    url: Cesium.IonResource.fromAssetId(1),
  });

  // Fly the camera to San Francisco at the given longitude, latitude, and height.
  viewer.camera.flyTo({
    destination : new Cesium.Cartesian3(4231278.189128528, 181738.561927225, 4772828.905668535),
    orientation : {
      heading : Cesium.Math.toRadians(0.0),
      pitch : -0.6999665236493904
    }
  });

  // Delete globe
  viewer.scene.scene3DOnly = true;
  viewer.scene.globe.depthTestAgainstTerrain = false;
  viewer.imageryLayers.removeAll()
  viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#AB9B8B').withAlpha(0.4);
  viewer.scene.fog.enable = true;
  viewer.scene.globe.showGroundAtmosphere = true;


  // Add all layer by default
  getLayers();

  // Create all interaction of page
  activeAllButtons();

  // Create the listening of event
  // click on Cesium canvas
  document.getElementById('cesiumContainer').addEventListener('click' , clickOnCesiumCanvas)

  // Create the importante variable that depend on viewer
  listePOIs.addPOILayer(new POILayer({name: 'geocoder'}));

  // try loading Poi
  try{
    initPOI();
  } catch {

  }

  // try loading BIM
  try{
    loadBimProject();
  } catch {

  }

  // End of init -> Destroy Loading Page
  destroyLoadingPage();

}

/**
 * Function tha get all the layers in BDD and display some of them in the cesium viewer
 */
function getLayers(){
  // get data from bdd
  fetch('php/getLayers.php').then(a => a.json()).then(a => {
    for(var i = 0 ; i < a.length ; i++){
      // Create new layer
      var newLayer = new Val3DLayer(a[i]);

      // if is visible by default
      if(newLayer.default_display == 'true'){
        // Draw the new layer in the cesium viewer
        newLayer.construct();
      }

      // add the new layer to the list of layer
      listeLayers.add(newLayer);
    }

  });
}



// VARIABLES
var viewer;
var listeGroups;
var listeLayers = new LayersGroup();
var listePOIs = new POIGroup();
var listeBIMs = new BimGroup();
var listeMeasure = {
  Point:[],
  Line:[],
  Area:[]
};
var new_line_buffer = [];
var clickViewerNoMove;

// EMPRISE DU VAL DE MARNE
var west = 2.3060611*Math.PI/180;
var east = 2.618337361*Math.PI/180;
var north = 48.863364561*Math.PI/180;
var south = 48.685819377*Math.PI/180;

// RAYON DE LA TERRE (m)
var RAYON_TERRE = 6380000;

// Zoom on a layer distance in number of radius of layer's boundingSphere
var flyToLayerDistance = 2;
var flyToPOIDistance = 1;

// Var menu save
var menusHTML = document.getElementById('menus').innerHTML;
var connectionHTML = document.getElementById('connection').innerHTML;

//ALGO
initPage();