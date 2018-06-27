<?php
include 'listaprodutos.php';

if(@$_REQUEST['action'] == "update") { 
    $id = @$_REQUEST['id'];
    $nome = @$_REQUEST['nome'];
    $marca = @$_REQUEST['marca'];
    $preco = @$_REQUEST['preco'];
    $saldo = @$_REQUEST['saldo'];
    echo update($id, $nome, $marca, $preco, $saldo);
} else if(@$_REQUEST['action'] == "insert") { 
    $nome = @$_REQUEST['nome'];
    $marca = @$_REQUEST['marca'];
    $preco = @$_REQUEST['preco'];
    $saldo = @$_REQUEST['saldo'];
    echo insert($nome, $marca, $preco, $saldo);
} else if(@$_REQUEST['action'] == "delete") { 
    $id = @$_REQUEST['id'];
    echo delete($id);
}

function update($id, $nome, $marca, $preco, $saldo) {
    $con = conectaDB();

    $nome = $con->real_escape_string($nome);
    $marca = $con->real_escape_string($marca);
    $preco = $con->real_escape_string($preco);
    $saldo = $con->real_escape_string($saldo);
    mysqli_query($con,"UPDATE produtos SET nome='$nome', marca='$marca', preco=$preco, saldo=$saldo WHERE id=$id");
    $con->close();
    return buscarPorId($id);
}

function insert($nome, $marca, $preco, $saldo) {
    $con = conectaDB();

    $nome = $con->real_escape_string($nome);
    $marca = $con->real_escape_string($marca);
    $preco = $con->real_escape_string($preco);
    $saldo = $con->real_escape_string($saldo);
    mysqli_query($con,"INSERT INTO produtos (nome, marca, preco, saldo) VALUES ('$nome', '$marca', $preco, $saldo)");
    $con->close();
    return true;
}

function delete($id) {
    $con = conectaDB();
    mysqli_query($con,"DELETE FROM produtos WHERE id=$id");
    $con->close();
    return true;
}

?>