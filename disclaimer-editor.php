<?php

header( 'Access-Control-Allow-Origin: *' );
header( 'Content-Type: text/html; charset=ISO-8859-1' );

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

$dbLink = mysqli_connect( $dbhost, $dbuser, $dbpass, $dbname );

if ( !$dbLink ) 
{
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    exit;
}

if ( $_POST['request'] == "createDisclaimer" ) 
{
    $clientName = $_POST['client'];

    $create_client_query = "
    INSERT INTO
        disclaimer_manager (`client`)
    VALUES
        ('$clientName');
    ";

    if ( $dbLink->query( $create_client_query ) ) 
    {
        echo 1;
    } 
    else 
    {
        echo "Error: " . $create_client_query . "<br>" . $dbLink->error;
    }
} 
else if ( $_POST['request'] == "getDisclaimers" ) 
{
    $client = $_POST["client"] . "%";
    $getClientNames = "
    SELECT
        *
    FROM 
        `disclaimer_manager`
    WHERE
        `client` LIKE '$client';
    ";

    $getResults = $dbLink->query( $getClientNames );

    $resultRows = array();
    if ( $getResults->num_rows > 0 ) 
    {
        while ( $r = mysqli_fetch_assoc( $getResults ) ) 
        {
            $resultRows[] = $r;
        }
        foreach ($resultRows as $key => $value) {
            $resultRows[$key]["disclaimer"] = explode( ",", $resultRows[$key]["disclaimer"] );
        }
    } 
    else 
    {
        $resultRows[] = 0;
    }
    print json_encode( $resultRows );
} 
else if ( $_POST['request'] == "updateDisclaimer" ) 
{
    $record_id = $_POST['record_id'];
    $clientName = $_POST['clientName'];
    $disclaimer = $_POST['disclaimer'];

    $add_client_query = "
    UPDATE 
        `disclaimer_manager`
    SET
            `disclaimer` = '$disclaimer'
    WHERE
        `record_id` = '$record_id'
    ";

    if ( $dbLink->query( $add_client_query ) ) 
    {
        echo 1;
    } 
    else 
    {
        echo "Error: " . $add_client_query . "<br>" . $dbLink->error;
    }
} 
else if ( $_POST['request'] == "deleteDisclaimer" ) 
{
    $record_id = $_POST['record_id'];

    $delete_dislaimer_query = "
    DELETE FROM 
        `disclaimer_manager`
    WHERE 
        `record_id` = '$record_id'
    ";

    if ( $dbLink->query( $delete_dislaimer_query ) ) 
    {
        echo 1;
    } 
    else 
    {
        echo "Error: " . $delete_dislaimer_query . "<br>" . $dbLink->error;
    }
}

mysqli_close( $dbLink );
die();