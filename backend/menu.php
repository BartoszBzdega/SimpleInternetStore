<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require './include/db.php';

if ($_SERVER['REQUEST_METHOD'] === "GET") {
    $stmt = "SELECT * FROM category WHERE status = 1";
    
    if ($result = $conn->query($stmt)) {
        $arr = array();
        while ($row = $result->fetch_assoc()) {
            $arr[] = $row['name'];
        }
        echo json_encode(['categories' => $arr]);
    } else {
        echo json_encode(['error' => 'Something went wrong']);
    }
}
?>