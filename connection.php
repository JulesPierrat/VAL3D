<?php
    # session_start
    session_start();

    # Get Info of connection
    $info = file_get_contents('conf/connectBDD.txt');
    $info = preg_split('/\n|\r\n?/',$info);
    $host = explode('=',$info[0])[1];
    $user = explode('=',$info[1])[1];
    $psw = explode('=',$info[2])[1];
    $db = explode('=',$info[3])[1];

    # Connect to BDD
    $link = mysqli_connect($host, $user, $psw);
    mysqli_select_db($link , $db);

    # We create request
    $sql = "select class from users where email = '".$_POST['email']."' and password = '".hash("sha256", hash('sha256', $_POST['psw']))."' limit 1";

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

    # if there is a result
    if(count($r) > 0){
        $_SESSION['user_group'] = $r[0]['class'];
        $_SESSION['email'] = $_POST['email'];
    } else {
        $_SESSION['user_group'] = 'BASIC';
        unset($_SESSION['email']);
    }

    header('Location: index.php');
    exit;

?>