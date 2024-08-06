<?php
error_reporting(E_ALL);

require_once './include/db.php';


function getGuestUserCart(){
    
    if(!isset($_SESSION['cart'])){
        $_SESSION['cart']=array();
    }
    echo json_encode(['cart'=> $_SESSION['cart']]);
}


function addToGuestUserCart(){
    $id = $_POST['id'];
    $image = $_POST['image'];
    //$price = $_POST['price'];
    $stock = $_POST['stock'];
    $quantity = $_POST['quantity'];
    if(!isset($_SESSION['cart'][$id])){
        $_SESSION['cart'][$id]['image']=$image;
        $_SESSION['cart'][$id]['stock']=$stock;
        $_SESSION['cart'][$id]['quantity']=$quantity;
        
        
    }else{
        $_SESSION['cart'][$id]['quantity']+=$quantity;
    }
    $price=getProdPrice($id);
    $_SESSION['cart'][$id]['price']=round(($price*$quantity),2);
    updateTotalCart();
    echo json_encode(['cart'=>$_SESSION['cart']]);
}

function getProdPrice($id){
    global $conn;
    $stmt = "SELECT price FROM products WHERE id=?;";
    $prep_stmt=$conn->prepare($stmt);
    $prep_stmt->bind_param('i',$id);
    $prep_stmt->execute();
    if($result=$prep_stmt->get_result()){
        return $result->fetch_assoc()['price'];
    }else{
        return -1;
    }
}

function updateTotalCart(){
    $total = 0.00;
    foreach($_SESSION['cart'] as $key => $item){
        if($key === 'total') continue;
        $total += $item['price'];
    }
    $total = round($total, 2);
    $_SESSION['cart']['total'] = $total;
}


function updateGuestUserCart($_PATCH){
    $id=$_PATCH['id'];
    $quantity = $_PATCH['quantity'];
    $_SESSION['cart'][$id]['quantity'] = $quantity;
    $price = $quantity * getProdPrice($id);
    $price = bcdiv($price, 1,2);
    $_SESSION['cart'][$id]['price'] = $price;
    updateTotalCart();
    echo json_encode(['cart'=>$_SESSION['cart']]);
}

?>