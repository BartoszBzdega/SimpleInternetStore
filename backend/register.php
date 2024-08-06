<?php
require './include/db.php';
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $stmt = 'describe users;';
    $result = $conn->query($stmt);
    $arr = array();
    while($row=$result->fetch_assoc()){
        array_push($arr,$row);
    }
    array_splice($arr,0,1);
    echo json_encode(['columns'=>$arr]);
    exit();
}
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $email = $_POST['email'];
    $firstname = $_POST['firstname'];
    $lastname = $_POST['lastname'];
    $stmt = "INSERT INTO users (username, password, email, firstname, lastname) VALUES (?,?,?,?,?);";
    $prep_stmt = $conn->prepare($stmt);
    $prep_stmt->bind_param('sssss',$username,$password,$email,$firstname,$lastname);
    if($prep_stmt->execute()){
        echo json_encode(['registration'=>true]);
    }else{
        echo json_encode(['error'=>'Registration failed']);
    }
    $prep_stmt->close();
    exit();
}