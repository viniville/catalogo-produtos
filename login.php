<?php
include 'conexao.php';


$con = conectaDB();
$linha = "";
//cod   codUsuario  titulo  mensagem  
$result = mysqli_query($con,"SELECT id, nome, login, senha FROM usuarios");
while($row = mysqli_fetch_array($result, MYSQLI_NUM)) {
    for($j = 0; $j < 4; $j++){
        $linha .=  "|".$row[$j]."|"; 
    }
    echo $linha."<br>&nbsp";
    $linha = "";
}

?>