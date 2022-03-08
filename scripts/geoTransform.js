Math.tanh = Math.tanh || function(x) {
    if(x === Infinity) {
        return 1;
    } else if(x === -Infinity) {
        return -1;
    } else {
        return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
    }
};

Math.atanh = Math.atanh || function(x) {
    return Math.log((1+x)/(1-x)) / 2;
};

function lambert93toWGPS(lambertE, lambertN) {

    var constantes = {
        GRS80E: 0.081819191042816,
        LONG_0: 3,
        XS: 700000,
        YS: 12655612.0499,
        n: 0.7256077650532670,
        C: 11754255.4261
    }

    var delX = lambertE - constantes.XS;
    var delY = lambertN - constantes.YS;
    var gamma = Math.atan(-delX / delY);
    var R = Math.sqrt(delX * delX + delY * delY);
    var latiso = Math.log(constantes.C / R) / constantes.n;
    var sinPhiit0 = Math.tanh(latiso + constantes.GRS80E * Math.atanh(constantes.GRS80E * Math.sin(1)));
    var sinPhiit1 = Math.tanh(latiso + constantes.GRS80E * Math.atanh(constantes.GRS80E * sinPhiit0));
    var sinPhiit2 = Math.tanh(latiso + constantes.GRS80E * Math.atanh(constantes.GRS80E * sinPhiit1));
    var sinPhiit3 = Math.tanh(latiso + constantes.GRS80E * Math.atanh(constantes.GRS80E * sinPhiit2));
    var sinPhiit4 = Math.tanh(latiso + constantes.GRS80E * Math.atanh(constantes.GRS80E * sinPhiit3));
    var sinPhiit5 = Math.tanh(latiso + constantes.GRS80E * Math.atanh(constantes.GRS80E * sinPhiit4));
    var sinPhiit6 = Math.tanh(latiso + constantes.GRS80E * Math.atanh(constantes.GRS80E * sinPhiit5));

    var longRad = Math.asin(sinPhiit6);
    var latRad = gamma / constantes.n + constantes.LONG_0 / 180 * Math.PI;

    var longitude = latRad / Math.PI * 180;
    var latitude = longRad / Math.PI * 180;

    return {longitude: longitude, latitude: latitude};
}

/**
 * Function that give you the altitude of a point
 * 
 * @param {float} lon
 * @param {float} Lat
 * 
 * @return {float} Altitude above ellipsoid of this point
 */
function getAltiIGN(lat , lon){
    var result  = false;
    result = fetch('https://wxs.ign.fr/calcul/alti/rest/elevation.json?lon='+lon+'&lat='+lat+'&zonly=true').then(a => a.json());
    return result;
}


/**
 * Function that transform WGS coordinates to L93
 * 
 * @param {float} lon Longitude WGS84
 * @param {float} lat Latitude WGS84
 * 
 * @return {Object} Coordonnées en Lambert 93;
 */
function WGSToL93(lon , lat){
    // define proj
    var WGS84 = proj4("EPSG:4326");
    proj4.defs("EPSG:2154","+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    var L93 = proj4("EPSG:2154");

    return proj4(WGS84 , L93 , [lon , lat]);
}