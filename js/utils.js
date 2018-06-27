/**
 * AJAX 
 */
function ajaxCall(stringCall, callback){
    var httpRequest = new XMLHttpRequest;
        
        httpRequest.onreadystatechange = function(){
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                  callback(httpRequest.responseText);
                }
            }
        };
        httpRequest.open('GET', stringCall);
        httpRequest.send();
}

function jsonIsValid(stringJson) {
    if (/^[\],:{}\s]*$/.test(stringJson.replace(/\\["\\\/bfnrtu]/g, '@').
                            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                            replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
        return true;
    } 
    return false;
}

/*********************************************
 *      Funções da pagina de login/index
 *********************************************/
function efetuarLogin(usuario) {
    
    sessionStorage.removeItem("usuario_logado");

    if(usuario !== 'null' && jsonIsValid(usuario)) {
        //sessionStorage.setItem("usuario_logado", JSON.stringify(usuario));
        sessionStorage.setItem("usuario_logado", usuario);
        console.log("Login realizado com sucesso! " + usuario);
        window.location="listaprodutos.html";
    } else {
        console.log("Login inválido. Usuário e/ou senha incorretos.");
        alert("Login inválido. Usuário e/ou senha incorretos.");
    }

}

function validarLogin() {
    let username = document.getElementById('usuario').value;
    let password = document.getElementById('senha').value;
    let url = "login.php?action=validarLogin&username=" + username + "&password=" + password;
    console.log("js - chamando validar login : " + url);
    ajaxCall(url, efetuarLogin);
}

function logoff() {
    sessionStorage.removeItem("usuario_logado");
    console.log("Logoff realizado com sucesso!");
    window.location="index.html";
}

function consultaTabelaProdutos(funcCallback) {
    let url = "listaprodutos.php?action=listarProdutos";
    console.log("js - chamando listaprodutos : " + url);
    ajaxCall(url, funcCallback);
}

function addProduto(nome, marca, preco, saldo) {
    let url = "insaltproduto.php?action=insert&nome="+encodeURI(nome)+"&marca="+encodeURI(marca)+"&preco="+encodeURI(preco)+"&saldo=" + +encodeURI(saldo);
    ajaxCall(url, function(retorno){
                        console.log("retornou insert produto" + retorno);
                        window.location="listaprodutos.html"; 
                        return;
                  });
    return;
}

function removeProduto(buttonRemove) {
    var idItem = buttonRemove.getAttribute("data-id");
    let url = "insaltproduto.php?action=delete&id="+idItem;
    ajaxCall(url, function(retorno){
        console.log("retornou delete produto" + retorno);
        window.location="listaprodutos.html"; 
        return;
    });
    return;
}

function showEditProdutoCallback(produto) {
    sessionStorage.setItem("produto_alteracao", produto);
    window.location="insaltproduto.html";
}

function showEditProduto(buttonEdit) {
    var idItem = buttonEdit.getAttribute("data-id");
    ajaxCall("listaprodutos.php?action=buscarPorId&id=" + idItem, showEditProdutoCallback);
}

function showAddProduto() {
    sessionStorage.removeItem("produto_alteracao");
    window.location="insaltproduto.html";
}

function inicializaApp() {
    sessionStorage.removeItem("usuario_logado"); 
    sessionStorage.removeItem("produto_alteracao");
}


function validaSessaoAtiva() {
    var usuarioLogado = sessionStorage.getItem("usuario_logado");
    if(usuarioLogado == undefined) {
        logoff();
        return false;
    }
    return true;
}

function preparaInsertAlterProduto() {
    var produtoAlterar = sessionStorage.getItem("produto_alteracao");
    if(produtoAlterar != undefined) {
        document.getElementById("operacao").innerText = "Alteração de produto";
        produtoAlterar = JSON.parse(produtoAlterar);
        document.getElementById("inputid").value = produtoAlterar.id;
        document.getElementById("inputnome").value = produtoAlterar.nome;
        document.getElementById("inputmarca").value = produtoAlterar.marca;
        document.getElementById("inputpreco").value = produtoAlterar.preco;
        document.getElementById("inputsaldo").value = produtoAlterar.saldo;
    } else {
        document.getElementById("operacao").innerText = "Inserção de produto";
        document.getElementById("inputsaldo").readOnly = false;
    }
}

function updateProduto(id, nome, marca, preco, saldo) {
    let url = "insaltproduto.php?action=update&id="+ id +"&nome="+encodeURI(nome)+"&marca="+encodeURI(marca)+"&preco="+encodeURI(preco)+"&saldo=" + +encodeURI(saldo);
    ajaxCall(url, function(retorno){
                        console.log("retornou update produto" + retorno);
                        sessionStorage.removeItem("produto_alteracao"); 
                        window.location="listaprodutos.html"; 
                        return;
                  });
}

function gravarInsAltProduto() {
    var idItem = document.getElementById("inputid").value;
    var nome = document.getElementById("inputnome").value;
    var marca = document.getElementById("inputmarca").value;
    var preco = document.getElementById("inputpreco").value;
    var saldo = document.getElementById("inputsaldo").value;
    
    if(idItem != undefined && idItem != "") {
        updateProduto(idItem, nome, marca, preco, saldo);
    } else {
        addProduto(nome, marca, preco, saldo);
    }
    return;
}

function cancelarInsAltProduto() {
    sessionStorage.removeItem("produto_alteracao");
    window.location="listaprodutos.html";
    return;
}

function carregaTabelaProdutos(strProdutos) {
    var produtos = JSON.parse(strProdutos);
    var divitens = document.getElementById("itens");
    var htmlitens = "";
    for (var i = 0; i < produtos.length; i++) {
        var iditem = produtos[i].id.trim();
        htmlitens += ' <tr> ' + 
                     ' <td><input type="button" value="Editar" data-id="'+iditem+'" onclick="javascript:showEditProduto(this); return;">&nbsp;' +
                          '<input type="button" value="Excluir"  data-id="'+iditem+'" onclick="javascript:removeProduto(this); location.reload(); return;"></td>' + 
                     ' <td>'+ produtos[i].nome +'</td>' + 
                     ' <td>'+ produtos[i].marca +'</td>' + 
                     ' <td>'+ produtos[i].preco +'</td>' + 
                     ' <td>'+ produtos[i].saldo +'</td>' + 
                     ' </tr>';        
    }
    divitens.innerHTML = htmlitens;    
}

function getHtmlTableProdutos() {
    consultaTabelaProdutos(carregaTabelaProdutos);
}
