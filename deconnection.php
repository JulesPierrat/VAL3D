<?php

session_start();
$_SESSION['user_group'] = 'BASIC';
unset($_SESSION['email']);
header('Location: index.php');
exit;

?>