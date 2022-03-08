<?php

# start session
session_start();

# get user group
$group = $_SESSION['user_group'];


# Get Path of VAL3D
$path = file_get_contents('PATH.txt');

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
$sql = "select * from poi order by id asc";

#We make the request
try{
    $result = mysqli_query($link , $sql);
}catch(Exception $e){
    die("Erreur : " . $e->getMessage());
}

# We save the request in array
$r = array();
$i = 0;
while($layer = mysqli_fetch_assoc($result)){
    # check access
    $access = explode(";", $layer['Access']);
    $accessible = false;
    foreach($access as $a){
        if($a == $group){
            $accessible = true;
        }
    }
    if ($accessible == true){
        $r[$i] = $layer;
    }
    $i++;
}

# We send it to client
echo json_encode($r);

?>