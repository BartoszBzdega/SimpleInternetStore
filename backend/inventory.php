<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require './include/db.php';
$cat=$_GET['id'];
if ($_SERVER['REQUEST_METHOD'] === "GET") {
    $stmt = "SELECT stock FROM inventory WHERE product_id=$cat";
    
    if ($result = $conn->query($stmt)) {
        echo json_encode(['stock' => $result->fetch_assoc()['stock']]);
    } else {
        echo json_encode(['error' => 'Something went wrong']);
    }
}
?>