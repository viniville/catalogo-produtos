<?php
include 'conexao.php';

if(@$_REQUEST['action'] == "validarLogin") { // Valida login
    $username = @$_REQUEST['username'];
    $password = @$_REQUEST['password'];
    echo validarLogin($username, $password);
}


function validarLogin($login, $senha) {
    $con = conectaDB();
    $usuario = null;
    $result = mysqli_query($con,"SELECT id, nome, login, senha FROM usuarios WHERE upper(login) like '$login' and senha like '$senha' ");
    $usuario = mysqli_fetch_assoc($result);
    $json = json_encode($usuario);
    mysqli_close($con);
    return $json;
}
?>