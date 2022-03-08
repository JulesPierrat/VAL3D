<?php

echo hash("sha256", hash('sha256', $_GET['psw']));

?>