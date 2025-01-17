<?php

    $stmt = $pdo->prepare("SELECT version FROM website");
    $stmt->execute();
    $version = $stmt->fetch()[0];

    echo $version;

?>