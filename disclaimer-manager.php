<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: text/html; charset=ISO-8859-1');

/////////////////////////////////////////////////
// OPTIONAL:
if ( $_SERVER['REMOTE_ADDR'] != '[[YOUR IP ADDRESS]]' ) 
{
    echo "Your IP address is verbotten.";
    die();
}
/////////////////////////////////////////////////

$dbhost = "127.0.0.1";
$dbuser = "[[username here]]";
$dbpass = "[[password here]]";
$dbname = "[[database name here]]";

$dbLink = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

if (!$dbLink) {
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    exit;
}

if ($_POST['request'] == "createClient") {
    $client = $_POST['clientName'];
    $slogan = $_POST['sloganText'];
    $createClient = "
        INSERT INTO
            `disclaimer_manager_meta` (`client`, `slogan`)
        VALUES
            ('$client', '$slogan');
    ";
    $update = $dbLink->query($createClient);

    $resultRows;
    if ($update->affected_rows != -1) {
        $resultRows = 1;
    } else {
        $resultRows = 0;
    }

    print json_encode($resultRows);
} else if ($_POST['request'] == "getClients") {
    $getClientNames = "
        SELECT 
            *
        FROM
            `disclaimer_manager_meta`
        ORDER BY client
    ";

    $getResults = $dbLink->query($getClientNames);

    $resultRows = array();
    if ($getResults->num_rows > 0) {
        while ($r = mysqli_fetch_assoc($getResults)) {
            $resultRows[] = $r;
        }
    } else {
        $resultRows[] = 0;
    }

    print json_encode($resultRows);
} else if ($_POST['request'] == "updateSlogan") {
    $client = $_POST["clientName"] . "%";
    $slogan = $_POST["sloganText"];
    $updateSlogan = "
        UPDATE 
            `disclaimer_manager_meta` 
        SET 
            `slogan` = '$slogan'
        WHERE 
            `client` LIKE '$client';
    ";

    $update = $dbLink->query($updateSlogan);

    $resultRows;
    if ($update->affected_rows != -1) {
        $resultRows = 1;
    } else {
        $resultRows = 0;
    }

    print json_encode($resultRows);
}

mysqli_close($dbLink);
die();
