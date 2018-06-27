<?php
function conectaDB(){
	$con  =  mysqli_connect("localhost","root","","catalogo");
	
	if(!$con){
		echo "<h2>Erro na conexao com a base dados...</h2>"; 
		echo "<h2> Erro " . mysqli_connect_errno() . ".</h2>";
		die();
	}
	$con->set_charset("utf8");
	return $con;
}


?>