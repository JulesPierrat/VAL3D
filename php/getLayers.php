<?php

# session start
session_start();

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
$sql = "select * from layer ORDER BY ID asc";

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
    $r[$i] = $layer;
    $i++;
}

# We set the array to take only the autorize layer
$nr = array();
for ($i = 0 ; $i < count($r) ; $i++){
    # get the array of the user
    $access = explode(";" , $r[$i]["Access"]);

    for ($j = 0 ; $j < count($access) ; $j++ ) {
        if($access[$j] == "NONE" or $access[$j] == $_SESSION['user_group']){
            array_push($nr, $r[$i]);
            break;
        }
    }

}


# We send it to client
echo json_encode($nr);

?>