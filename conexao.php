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

function consulta($sql) {
	$conexao = conectaDB();
	$result = mysqli_query($conexao,$sql);

	$retData  =  array();
	while( $row = mysqli_fetch_array($result, MYSQLI_NUM) ){
	  $retData[] = $row;
	}

	mysqli_close($conexao);
	return $retData;	
}

function consultaSingle($sql) {
	$ret = consulta($sql);
	if(count($ret) > 0) {
		return $ret[0];
	}
	else {
		return null;
	}
	/*
	if(mysqli_num_rows($result) > 0) {
		return $ret[0];
	}
	else {
		return null;
	}
	*/
}
?>