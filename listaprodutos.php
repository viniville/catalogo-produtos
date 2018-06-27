<?php
include 'conexao.php';

if(@$_REQUEST['action'] == "listarProdutos") { // Valida login
    echo listarProdutos();
} else if(@$_REQUEST['action'] == "buscarPorId") { // Valida login
    $idItem = @$_REQUEST['id'];
    echo buscarPorId($idItem);
}


function listarProdutos() {
    $con = conectaDB();
    $produtos = array();
    $result = mysqli_query($con,"SELECT id, nome, marca, preco, saldo FROM produtos");
    while($row = mysqli_fetch_assoc($result)) {
        $produtos[] = $row;
    }
    $json = json_encode($produtos);
    mysqli_free_result($result);
    mysqli_close($con);
    return $json;
}

function buscarPorId($id) {
    $con = conectaDB();
    $result = mysqli_query($con,"SELECT * FROM produtos WHERE id=$id");
    $json = json_encode(mysqli_fetch_assoc($result));
    mysqli_free_result($result);
    mysqli_close($con);
    return $json;
}
?>