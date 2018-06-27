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

/* ***************************************** */
function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
}
  
function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16).substring(1);
}

function setTabUsuarios(usuarios) {
    sessionStorage.setItem("tab_usuarios", JSON.stringify(usuarios));
}

function getTabUsuarios() {
    var jsonUsuarios = sessionStorage.getItem("tab_usuarios");
    return JSON.parse(jsonUsuarios);    
}

function addUsuario(nome, login, senha) {
    var str = '{"nome":"%NOME%", "login":"%LOGIN%", "senha":"%SENHA%"}';
    str = str.replace("%NOME%", nome);
    str = str.replace("%LOGIN%", login);
    str = str.replace("%SENHA%", senha);
    var usuario = JSON.parse(str);
    var listUsuarios = getTabUsuarios();
    listUsuarios.push(usuario);
    setTabUsuarios(listUsuarios);
    return listUsuarios.length;    
}

function setTabProdutos(produtos) {
    sessionStorage.setItem("tab_produtos", JSON.stringify(produtos));
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
}


function removeProduto(buttonRemove) {
    var idItem = buttonRemove.getAttribute("data-id");
    var listProdutos = getTabProdutos();
    for (var i = 0; i < listProdutos.length; i++) {
        if(listProdutos[i].id.toUpperCase() == idItem.toUpperCase().trim()) {
            listProdutos.splice(i, 1);
            setTabProdutos(listProdutos);
            break;
        }
    }
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
    //registra no sessionStorage os dados utilizados na aplicação
    /*
    var usuarios = '[ {"nome":"Vinicius Ville", "login":"vinicius", "senha":"1234"},'+
                      '  {"nome":"Joao da Silva", "login":"joao", "senha":"1234"},'+
                      '  {"nome":"Maria da Silva", "login":"maria", "senha":"1234"},'+
                      '  {"nome":"Josefa Gonçalvez", "login":"josefa", "senha":"1234"},'+
                      '  {"nome":"Gustavo Martins", "login":"gustavo", "senha":"1234"}]';
    
     var produtos = '[ {"id":"96123b43-01b8-3265-b5be-0568d3305bc2", "nome":"Produto A", "marca":"Marca X", "preco":"10.20", "saldo":100},'+
                      '  {"id":"f4512232-1b02-2017-f191-6c4f9db26580", "nome":"Produto B", "marca":"Marca X", "preco":"10.20", "saldo":"80"},'+
                      '  {"id":"145e5a99-4463-778b-92d6-5393a4a9fa17", "nome":"Produto C", "marca":"Marca X", "preco":"10.20", "saldo":"50"},'+
                      '  {"id":"58ae66c5-b1d5-bc11-64ca-4c380182776d", "nome":"Produto D", "marca":"Marca X", "preco":"10.20", "saldo":"40"},'+
                      '  {"id":"9ad16d72-d827-b7b0-8843-1823bcbc85df", "nome":"Produto E", "marca":"Marca X", "preco":"10.20", "saldo":"30"}]';
                      
    setTabUsuarios(JSON.parse(usuarios));
    setTabProdutos(JSON.parse(produtos));
    */
    sessionStorage.removeItem("usuario_logado"); 
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
