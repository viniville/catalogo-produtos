<?php
include 'conexao.php';

if(@$_REQUEST['action'] == "validarLogin") { // Valida login
    $username = @$_REQUEST['username'];
    $password = @$_REQUEST['password'];
    $usuario validarLogin($username, $password);
    echo $usuario;
    //"php chegou no metodo validar login - $username ----- $password";
} 






function validarLogin($login, $senha) {
    $con = conectaDB();
    $usuario = null;
    $result = mysqli_query($con,"SELECT id, nome, login, senha FROM usuarios WHERE upper(login) like '$login' and senha like '$senha' ");
    while($row = mysqli_fetch_array($result, MYSQLI_NUM)) {
        $usuario = $row;
    }
    return json_encode($usuario);
}

//echo validarLogin('vinicius', '12134');


/*

$linha = "";
//cod   codUsuario  titulo  mensagem  
$result = mysqli_query($con,"SELECT * FROM usuarios");
while($row = mysqli_fetch_array($result, MYSQLI_NUM)) {
    for($j = 0; $j < 4; $j++){
        $linha .=  "|".$row[$j]."|"; 
    }
    echo $linha."<br>&nbsp";
    $linha = "";
}
*/

?>