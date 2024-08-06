<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require './include/db.php';

if ($_SERVER['REQUEST_METHOD'] === "GET") {
    $stmt = "SELECT * FROM products WHERE status = 1 ORDER BY added_on DESC LIMIT 9";
    
    if ($result = $conn->query($stmt)) {
        $arr = array();
        while ($row = $result->fetch_assoc()) {
            $arr[] = $row;
        }
        echo json_encode(['newArrivals' => $arr]);
    } else {
        echo json_encode(['error' => 'Something went wrong']);
    }
}
?>