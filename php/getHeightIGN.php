<?php
// get lat and lon
$lat = $_GET['lat'];
$lon = $_GET['lon'];

// get the ign key
$path = file_get_contents('PATH.txt');
$key = file_get_contents($path.'/conf/clef_geoportail.txt');

// set the url
$url = 'https://wxs.ign.fr/'.$key.'/alti/rest/elevation.json';
$url = 'http://www.google.fr/';

$curl = curl_init();
curl_setopt($curl , CURLOPT_URL , $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_COOKIESESSION, true);
curl_setopt($curl, CURLOPT_POST, true);

$postfields = array(
    'lon' => $lon,
    'lat' => $lat,
    'zonly' => 'true'
);

curl_setopt($curl, CURLOPT_POSTFIELDS, $postfields);

$result = curl_exec($curl);

echo $result;
print_r($result);

curl_close($curl);

echo $result;
print_r($result);
?>