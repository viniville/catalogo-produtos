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

function getTabProdutos() {
    var jsonProdutos = sessionStorage.getItem("tab_produtos");
    return JSON.parse(jsonProdutos);    
}

function addProduto(nome, marca, preco, saldo) {
    var str = '{"id":"%ID%", "nome":"%NOME%", "marca":"%MARCA%", "preco":"%PRECO%", "saldo":%SALDO%}';
    var newUuid = guid();
    str = str.replace("%ID%", newUuid.trim());
    str = str.replace("%NOME%", nome);
    str = str.replace("%MARCA%", marca);
    str = str.replace("%PRECO%", preco);
    str = str.replace("%SALDO%", saldo);
    var produto = JSON.parse(str);
    var listProdutos = getTabProdutos();
    listProdutos.push(produto);
    setTabProdutos(listProdutos);
    return listProdutos.length;
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

function showEditProduto(buttonEdit) {
    var idItem = buttonEdit.getAttribute("data-id");
    var listProdutos = getTabProdutos();
    for (var i = 0; i < listProdutos.length; i++) {
        if(listProdutos[i].id.toUpperCase() == idItem.toUpperCase().trim()) {
            sessionStorage.setItem("produto_alteracao", JSON.stringify(listProdutos[i]));
            break;
        }
    }
    window.location="insaltproduto.html";
}

function showAddProduto() {
    sessionStorage.removeItem("produto_alteracao");
    window.location="insaltproduto.html";
}

function inicializaApp() {
    //registra no sessionStorage os dados utilizados na aplicação
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
    sessionStorage.removeItem("usuario_logado"); 
}

function login(usuario) {
    sessionStorage.setItem("usuario_logado", JSON.stringify(usuario));
    console.log("Login realizado com sucesso!");
    window.location="listaprodutos.html";
}

function logoff() {
    sessionStorage.removeItem("usuario_logado");
    console.log("Logoff realizado com sucesso!");
    window.location="index.html";
}

function validaSessaoAtiva() {
    var usuarioLogado = sessionStorage.getItem("usuario_logado");
    if(usuarioLogado == undefined) {
        logoff();
        return false;
    }
    return true;
}

function validarLogin() {
    let username = document.getElementById('usuario').value;
    let password = document.getElementById('senha').value;

    sessionStorage.removeItem("usuario_logado");
    var listUsuarios = getTabUsuarios();

    for (var i = 0; i < listUsuarios.length; i++) {
        if(listUsuarios[i].login.toUpperCase() == username.toUpperCase()) {
            if(listUsuarios[i].senha == password) {
                login(listUsuarios[i]);
                return;
            }
        }
    }
    console.log("Login inválido");
    alert("Login inválido");
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

function gravarInsAltProduto() {
    var idItem = document.getElementById("inputid").value;
    var nome = document.getElementById("inputnome").value;
    var marca = document.getElementById("inputmarca").value;
    var preco = document.getElementById("inputpreco").value;
    var saldo = document.getElementById("inputsaldo").value;
    
    if(idItem != undefined && idItem != "") {
        var itemAlterado = false;
        var listProdutos = getTabProdutos();
        for (var i = 0; i < listProdutos.length; i++) {
            if(listProdutos[i].id.toUpperCase() == idItem.toUpperCase().trim()) {
                listProdutos[i].nome = nome;
                listProdutos[i].marca = marca;
                listProdutos[i].preco = preco;
                listProdutos[i].saldo = saldo;
                itemAlterado = true;
                break;
            }
        }
        if(itemAlterado) {
            setTabProdutos(listProdutos);
        }
        sessionStorage.removeItem("produto_alteracao");
    } else {
        addProduto(nome, marca, preco, saldo);
    }
    window.location="listaprodutos.html";
    return;
}

function cancelarInsAltProduto() {
    sessionStorage.removeItem("produto_alteracao");
    window.location="listaprodutos.html";
    return;
}

function getHtmlTableProdutos() {
    var divitens = document.getElementById("itens");
    var produtos = getTabProdutos();
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
