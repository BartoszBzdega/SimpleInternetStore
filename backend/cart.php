<?php
error_reporting(E_ALL);

require './include/guestUsercart.php';
require './include/loggedUserCart.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if(isset($_SESSION['logged_user'])){
        getLoggedUserCart();
    }else{
        getGuestUserCart();
    }
    exit();

}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if(isset($_SESSION['logged_user'])){
        addToLoggedUserCart();
    }else{
        addToGuestUserCart();
    }
    exit();

}
if ($_SERVER['REQUEST_METHOD'] == 'PATCH') {
    parse_str(file_get_contents('php://input'),$_PATCH);
    if(isset($_SESSION['logged_user'])){
        updateLoggedUserCart($_PATCH);
    }else{
        updateGuestUserCart($_PATCH);
    }
    exit();
}




?>