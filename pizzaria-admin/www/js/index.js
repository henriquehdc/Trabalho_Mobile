var pizza;
var preco;
var pizzaria_id = 'Dallas_Pizzaria';
var listaPizzasCadastradas = [];


function onDeviceReady() {
    
    cordova.plugin.http.setDataSerializer('json');
    document.getElementById('btnCancelar').addEventListener('click', cancelar);
    document.getElementById('btnNovo').addEventListener('click', novo);
    document.getElementById('btnSalvar').addEventListener('click', salvar);
    document.getElementById('btnExcluir').addEventListener('click', excluir);
    document.getElementById('btnFoto').addEventListener('click', foto);
    imagem = document.getElementById('imagem');
    pizza = document.getElementById('pizza');
    preco = document.getElementById('preco');
    carregarPizzas();
}

function novo() {
    applista.style.display = 'none'; 
    appcadastro.style.display = 'flex'; 
}

function foto() {
    navigator.camera.getPicture(onSuccess, 
                                onFail, 
                                { quality: 50, 
                                  destinationType: Camera.DestinationType.DATA_URL }
                               );  
    
    function onSuccess(imageData) {
        imagem.style.backgroundImage = "url('data:image/jpeg;base64," + imageData + "')"; 
    }      
    function onFail(message) { 
        alert('Failed because: ' + message); 
    }
}

function salvar() {
    cordova.plugin.http.setDataSerializer('json');
    cordova.plugin.http.post('https://pedidos-pizzaria.glitch.me/admin/pizza/', {
        pizzaria: pizzaria_id, 
        pizza: pizza.value, 
        preco: preco.value, 
        imagem: imagem.style.backgroundImage
    }, {}, function(response) {
        alert(response.status);
    }, function(response) {
        alert(response.error);
    });
}

function excluir() {
    var nome_pizza = document.getElementById('pizza').value;
    cordova.plugin.http.delete('https://pedidos-pizzaria.glitch.me/admin/pizza/'+ pizzaria_id + '/' + nome_pizza,{ 
    }, {}, function(response) {
        alert(response.status);
    }, function(response) {
        alert(response.error);
    });
    cancelar();
}

function cancelar() {  
    limpaTela();
    carregarPizzas();
    applista.style.display = 'flex'; 
    appcadastro.style.display = 'none'; 
}

function carregarPizzas() {
    cordova.plugin.http.get('https://pedidos-pizzaria.glitch.me/admin/pizzas/' + pizzaria_id, {   
    }, {}, function(response) {
        if(response.data != null) {
            listaPizzasCadastradas = JSON.parse(response.data);
            listaPizzasCadastradas.forEach((item, idx) => {
                const novo = document.createElement('div');
                novo.classList.add('linha');
                novo.innerHTML = item.pizza;
                novo.id = idx;
                novo.onclick = function () {
                    carregarDadosPizza(novo.id);
                    applista.style.display = 'none'; 
                    appcadastro.style.display = 'flex'; 
                };
                listaPizzas.appendChild(novo);
            });
        }
    }, function(response) {
        alert(response.error);
    });     
}

function carregarDadosPizza(id) {
    imagem.style.backgroundImage = listaPizzasCadastradas[id].imagem;
    pizza.value = listaPizzasCadastradas[id].pizza;
    preco.value = listaPizzasCadastradas[id].preco;
    let Pizza_id = listaPizzasCadastradas[id]._id;
    btnSalvar.onclick = function(){
        attPizza(Pizza_id);
    }
}

function attPizza(id) {
    var pizza_nome= document.getElementById('pizza').value;
    var pizza_imagem= document.getElementById('imagem').value;
    var pizza_preco= document.getElementById('preco').value;
    cordova.plugin.http.setDataSerializer('json');
    cordova.plugin.http.put('https://pedidos-pizzaria.glitch.me/admin/pizza/',
    {   
        _id: id,
        pizzaria: pizzaria_id,
        pizza: pizza_nome, 
        preco: pizza_preco, 
        imagem: pizza_imagem
    }, {}, function(response){
        alert(response.status);
    }, function(response){
        alert(response.error);
    })
}

function limpaTela() {
    let listaPizzas = document.getElementById('listaPizzas');
    listaPizzas.innerText = "";
}