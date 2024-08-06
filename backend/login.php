<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require './include/db.php';
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['q'])) {
    if(isset($_SESSION['logged_user'])){
        echo json_encode(['user'=>$_SESSION['logged_user']['name']]);
    }else{
        echo json_encode(['user'=>'guest']);
    }
    exit();
}
if ($_SERVER['REQUEST_METHOD'] === 'GET'){
    if(isset($_SESSION['logged_user'])){
        session_unset();
        session_destroy();
        echo json_encode(['logout'=>true]);
    }else{
        echo json_encode(['logout'=>false]);
    }
    exit();
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username= $_POST['username'];
    $password= $_POST['password'];

    $stmt = "SELECT * FROM users WHERE username = ? AND password=?";
    $prep_stmt=$conn->prepare($stmt);
    $prep_stmt->bind_param('ss',$username,$password);
    $prep_stmt->execute();
    $result = $prep_stmt->get_result();
    if ($user_array = $result->fetch_assoc()) {
        $_SESSION['logged_user']['name'] =$user_array['username'];
        $_SESSION['logged_user']['id'] = $user_array['id'];
        echo json_encode(['user'=>$_SESSION['logged_user']['name']]);
    }else{
        
        echo json_encode(['error'=>'niepoprawne haslo albo nazwa usera']);
        $prep_stmt->close();
        exit();
    }

}
?>