<?php

    include_once('../../search_function.php');

    $query = $_POST["query"];
    echo json_encode(autoComplete($query));

?>