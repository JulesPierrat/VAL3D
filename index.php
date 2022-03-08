<?php

// Start Session
session_start();

// Set the user group to basic
if ( !isset($_SESSION['user_group']) ){
	$_SESSION['user_group'] = "BASIC";
}

?>


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>VAL3D</title>
  <!-- Include the CesiumJS JavaScript and CSS files -->
  <script src="./lib/cesiumjs/Build/Cesium/Cesium.js"></script>
  <link href="./lib/cesiumjs/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
  <!-- Include the geoserver terrain provider plugin -->
  <!-- <script src="./lib/Cesium-GeoserverTerrainProvider/GeoserverTerrainProvider.js"></script> -->
  <!-- Include the proj4 JavaScript file -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.7.5/proj4.js" integrity="sha512-MMmVaQGDVI3Wouc5zT5G7k/snN9gPqquIhZsHgIIHVDlRgYTYGxrwu6w482iIhAq8n5R6+pcBgpGgxFFBz7rZA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <!-- MON CSS -->
  <link href="./styles/mainstyle.css" rel='stylesheet'>
  <!-- SCRIPT IMPORTANT -->
  <script src='./scripts/geoTransform.js'></script>
  <script src='./scripts/event.js'></script>
  <script src='./scripts/connection.js'></script>

  <!-- LOAD MODULE -->
  <?php
# Get Path of VAL3D
$path = file_get_contents('php/PATH.txt');

# Get Info of connection
$info = file_get_contents($path.'/conf/connectBDD.txt');
$info = preg_split('/\n|\r\n?/',$info);
$host = explode('=',$info[0])[1];
$user = explode('=',$info[1])[1];
$psw = explode('=',$info[2])[1];
$db = explode('=',$info[3])[1];

# Connect to BDD
$link = mysqli_connect($host, $user, $psw);
mysqli_select_db($link , $db);

# We create request
$sql = "select * from plugin order by Id asc";

#We make the request
try{
    $result = mysqli_query($link , $sql);
}catch(Exception $e){
    die("Erreur : " . $e->getMessage());
}

# We save the request in array
$r = '';
$plugins = array();
$i = 0;

while($plugin = mysqli_fetch_assoc($result)){
	// get the list of authorize people
	$liste = explode(';' , $plugin['Access']);
    if(in_array($_SESSION['user_group'] , $liste) or in_array('ALL' , $liste)){
        $r = $r.'<script src='.$plugin['Path'].'></script>';
	    $plugins[$i] = $plugin;
	    $i++;
    }
}

// Save list of plugins
$_SESSION['plugins'] = $plugins;

# We send it to client
echo $r;

?>


  <script src='./scripts/display.js'></script>
  <script src='./scripts/Val3DLayer.js'></script>
  <script src='./scripts/Val3DPOI.js'></script>
  <script src='./scripts/VAL3DBim.js' ></script>
</head>
<body>
	<div id='loadingPage'>
		<div style='width:400px;height:200px;margin:auto;'><img src='media/img/logo_val_de_marne.jpg' width='100%'></div>
	</div>
	<div id='header'>
		<div style='height:100%;width:150px;display:flex;'><img src='media/img/logo_val_de_marne.jpg' height='100%' style='margin:auto;'></div>
		<div id='connection'>
			<p id='connection_label'><?php
				if(!isset($_SESSION['email'])){
					echo 'SE CONNECTER';
				} else {
					echo $_SESSION['email'];
				}
			?></p>
			<button id='connection_button' onclick='openConnectionModal();'><img src='media/img/connect_button.png' height='80%' style='margin:auto;'></button>
		</div>
	</div>
	<div id='main'>
		<div id='menus'>
			<?php
				// get every module
				$r = '';
				foreach($plugins as $key => $p){
					$funcName = strtoupper($p['Code'][0]).substr($p['Code'],1,strlen($p['Code']));
					$r = $r.'<button id="menus_button_'.$p['Code'].'" class="menus_buttons" onclick="open'.$funcName.'Menu();"><img src="media/img/icon_'.$p['Code'].'.png" width="60%"></button>';
				}
				echo $r;
			?>
		</div>
		<div id='menu'>
			<div id='menu_container'>
				<div style='height:60px;width:100%;display:flex;justify-content: center;'><h1 id='menu_container_title'>XXXXXXXXXXXXXX</h1></div>
				<div id='menu_container_core' style='width:100%;'>
					<?php
						// get every module
						$r = '';
						foreach($plugins as $key => $p){
							$r = $r."<div id='div_".$p['Code']."_menu' style='display:none;width:100%;height:100%'></div>";
						}
						echo $r;
					
					?>

				</div>
			</div>
			<div id='menu_touchbar'></div>
		</div>
		<div id="cesiumContainer"></div>
	</div>
	<div id='modal_POI' style='display:none;'>
		<div id=modal_POI_container>
		</div>
	</div>
	<div id='modal_connection' style='display:none;'>
		<h2 style='margin:auto;color:black;margin-bottom:15px;'>SE CONNECTER</h2>
		<form action="connection.php" method="post">
			<input class='input_login' type="text" placeholder="e-mail" name="email" required>
			<input class='input_login' type="password" placeholder="Mot de passe" name="psw" required>
			<div></div>
			<button id='login_button' type="submit">Se connecter</button>
		</form>
		<?php
			if(isset($_SESSION['email'])){
				echo
				"<h2 style='margin:auto;color:black;margin-top:20px;'>SE DECONNECTER</h2>
				<form action='deconnection.php' method='post'>
					<button id='logout_button' type='submit'>Se déconnecter</button>
				</form>";
			}
		?>
	</div>
  	<script src='scripts/main.js'></script>
</body>
</html>
</html>