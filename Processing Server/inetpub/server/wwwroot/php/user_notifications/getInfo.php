<?php

    include_once('../../default_function.php');

    $numbers = $_POST['numbers'];
    $info = getNotificationsInfo($numbers);

    echo json_encode($info);

?>