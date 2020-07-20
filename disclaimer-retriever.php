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

$requestedDisclaimers = implode(",",json_decode($_POST["selectedDisclaimers"]));

$selected_disclaimer_query = "
    SELECT 
        `disclaimer`
    FROM
        `disclaimer_manager`
    WHERE
        `record_id` IN ($requestedDisclaimers)
    ORDER BY FIND_IN_SET(`record_id`,'$requestedDisclaimers');
";

$getDisclaimers = $dbLink->query($selected_disclaimer_query);

$resultRows = array();
if ($getDisclaimers->num_rows > 0) {
    while ($r = mysqli_fetch_assoc($getDisclaimers)) {
        $resultRows[] = $r;
    }
} else {
    $resultRows[] = "No disclaimers found. Requested disclaimers were: " + json_encode($requestedDisclaimers);
}

$footnoteMarks = ["*", "**", "***", "†", "‡"];
foreach ($resultRows as $key => $value) {
    $resultRows[$key] = array( $footnoteMarks[$key], implode( "",$value ) );
}

print json_encode($resultRows);

mysqli_close($dbLink);
die();