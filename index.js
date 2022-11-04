//Crio uma constante que lê os seletores input
//Atividade
let texto = document.querySelector('.txtInputTarefa input');
//Categoria
let categoria = document.querySelector('.txtInputCategoria select');
//hora
let hora = document.querySelector('.txtInputHora input');
//filtro
let filter = document.querySelector('.filter select');

let modalTarefas = new bootstrap.Modal(document.getElementById('modal'));



let edita = false;

//Pego o clique no + para editar texto do modal
const btnAbreModal = document.getElementById('addTarefa');

btnAbreModal.onclick = () => {
  document.getElementById('modal-titulo').innerHTML = 'Nova Tarefa';
  document.getElementById('salvar').innerHTML = 'Salvar';
  document.querySelector('.txtInputTarefa input').value = '';
  document.querySelector('.txtInputCategoria select').value = '';
  document.querySelector('.txtInputHora input').value = '';
  edita = false;
}

//Lê dentro da class .modal-footer o atributo button
const btnInsert = document.querySelector('.modal-footer button');

//Delete All - Lê dentro da classe header o atributo button
const btnDeleteAll = document.querySelector('.footer button');

//Btn Edição de Categorias
const btnEditCategorias = document.querySelector('.txtInputCategoria span');

//Leio todos as listas (atentar para que se usar outra lista ordenada agrupar por classe ou dentro de algum id)
const ul = document.querySelector('ul');

//Inicaliza a variável ítensDB como um array
//Observar que ela fica como var para ser usada no escopo de funções posteriores
var itensDB = []


//Ação de deletar todos os registros
//O delete apenas registra o valor vazio no array
btnDeleteAll.onclick = () => {
  if (confirm('Tem certeza que deseja limpar suas tarefas?')) {
    itensDB = []
    updateDB();
  }
}

//Ativação do botão de edição de categorias
btnEditCategorias.onclick = () => {
  document.getElementById("modalcategoria").style.display = "block";
  //Oculto o botão salvar e o close modal tarefas
  document.getElementById("salvar").style.display = "none";
  document.getElementById("close-modal-tarefa").style.display = "none";
  document.getElementById("form").style.display = "none";
  //Carrego as categorias
  loadItensCategorias();
}

function closeCategorias() {
  document.getElementById("modalcategoria").style.display = "none";
  document.getElementById("form").style.display = "block";
  //Exibo o botão salvar
  document.getElementById("salvar").style.display = "block";
  document.getElementById("close-modal-tarefa").style.display = "block";

  carregaItensCategorias();
}


//Ação ao pressionar tecla. apenas tecla enter está configurada
hora.addEventListener('keypress', e => {
  if (e.key == 'Enter' && texto.value != '') {
    if (edita) {
      const i = document.getElementById('id-edita').value;
      removeItem(i);
    }
    setItemDB();
  }
});

//Ação ao clicar botão btnInsert
btnInsert.onclick = () => {
  //Analiso se o conteúdo do botão é diferente de vazio
  if (texto.value != '' && categoria.value != '' && hora.value != '') {
    //Verifico se é update, caso seja apago o item anterior    
    if (edita) {
      const i = document.getElementById('id-edita').value;
      removeItem(i);
    }
    setItemDB();//Seta itemDB
    texto.style.borderColor = '#ced4da';
    categoria.style.borderColor = '#ced4da';
    hora.style.borderColor = '#ced4da';
    modalTarefas.toggle();
  } else {
    texto.style.borderColor = (texto.value == '') ? '#dc3545' : '#ced4da';
    categoria.style.borderColor = (categoria.value == '') ? '#dc3545' : '#ced4da';
    hora.style.borderColor = (hora.value == '') ? '#dc3545' : '#ced4da';
    return;
  }
}

texto.onblur = () => {
  texto.style.borderColor = (texto.value == '') ? '#dc3545' : '#00c04b';
}

categoria.onchange = () => {
  categoria.style.borderColor = (categoria.value == '') ? '#dc3545' : '#00c04b';
}

hora.onblur = () => {
  hora.style.borderColor = (hora.value == '') ? '#dc3545' : '#00c04b';
}

//Inserir ítem no LS
function setItemDB() {
  if (itensDB.length >= 20) {//Limita em 20 as atividades
    alert('Limite máximo de 20 atividades atingido!');
    return
  }
  //Adiciona um ítem ao array  
  itensDB.push({ 'item': texto.value, 'categoria': categoria.value, hora: hora.value, 'status': '' });
  console.log('Tarefa ' + texto.value);
  //console.log(texto.value);
  updateDB();
}

//Atualizo Local Storage com os dados armazenados no itensDB
function updateDB() {
  itensDB.sort((a, b) => {
    const horaA = (a.hora ?? '00:00').toString();
    const horaB = (b.hora ?? '00:00').toString();
    return horaA.localeCompare(horaB);
  });
  //console.log(itensDB);
  localStorage.setItem('todolist', JSON.stringify(itensDB))
  loadItens();
}

//Atualizo as categorias
// function updateCategoria() {
//   localStorage.setItem('listcategorias', JSON.stringify(itensCategorias))
//   //loadItens();
// }

function loadItens() { //line-tho AQUIIIIIIIIIIIII
  document.getElementById('todoList').value = 'all';
  ul.innerHTML = "";
  itensDB = JSON.parse(localStorage.getItem('todolist')) ?? [];
  if (itensDB.length > 0) {
    document.getElementById('footer-trash').style.display = 'block';
  } else {
    document.getElementById('footer-trash').style.display = 'none';
  }
  itensDB.forEach((item, i) => {
    insertItemTela(item.item, item.categoria, item.hora, item.status, i);
  })
}

const dataAtual = new Date();

const horaAtual = dataAtual.getHours() + ':' + dataAtual.getMinutes();

let classe = true;

//console.log(typeof horaAtual);

//Inserir ítem na tela
function insertItemTela(text, categoria, hora, status, i) {

  const li = document.createElement('li');

  if (status == '') {
    if (horaAtual > hora) {
      classe = 'texto-danger';
    } else {
      classe = 'texto-black';
    }
  }else{
    classe = 'texto-black';
  }

  li.innerHTML = `
    <div class="divLi ${classe}" id="linha-${i}">
      <input type="checkbox" ${status} data-i=${i} onchange="done(this, ${i});" />
      <span data-si=${i} classe="${classe}">${text}</span>
      <span classe="${classe}">${categoria}</span>
      <span classe="${classe}">${hora}</span>
      <button onclick="editaItem(${i})" data-bs-toggle="modal" data-bs-target="#modal" data-i=${i}><i class='bx bx-edit'></i></button>
      <button onclick="removeItem(${i})" data-i=${i}><i class='bx bx-trash'></i></button>
    </div>
    `;
  //Adiciona uma ul ao final da lista
  ul.appendChild(li);

  //Linha riscada - Atividade Concluída
  if (status) {
    document.querySelector(`[data-si="${i}"]`).classList.add('line-through');
    document.getElementById(`linha-${i}`).classList.add('line-through');
    return ('completo'); //para filtro
  } else {
    document.querySelector(`[data-si="${i}"]`).classList.remove('line-through');
    document.getElementById(`linha-${i}`).classList.remove('line-through');
    return ('imcompleto'); //para filtro
  }
  //texto.value = '';

}

//Ação para filtrar as tarefas


filter.onchange = () => {
  var select = document.getElementById("todoList");
  //Opção selecionada
  const selecionado = select.options[select.selectedIndex].value;
  const classes = document.querySelectorAll('.line-through');
  const uls = document.querySelectorAll('ul li');
  uls.forEach(element => {
    element.style.display = "block";
  });
  switch (selecionado) {
    case 'all':
      classes.forEach(element => {
        let divAnterior = element.closest("li");
        divAnterior.style.display = "block";
      });
      break;
    case 'completed':
      //Oculto as lis que não tem a classe
      //var obj=document.getElementById(idObj).hidden=true;
      uls.forEach(element => {
        element.style.display = "none";
      });
      classes.forEach(element => {
        let divAnterior = element.closest("li");
        divAnterior.style.display = "block";
      });
      break;
    case 'uncompleted':
      classes.forEach(element => {
        let divAnterior = element.closest("li");
        divAnterior.style.display = "none";
      });
      break;

    default:
      break;
  }
}

function filtrarItens(filtro) {

  filtro.forEach(element => {
    element.style.display = "none";
  });
}



function done(chk, i) {

  if (chk.checked) {
    itensDB[i].status = 'checked'
  } else {
    itensDB[i].status = ''
  }
  updateDB();
}

function removeItem(i) {
  itensDB.splice(i, 1);//Alterar conteúdo do array e reordenar o mesmo
  updateDB();
}

function editaItem(i) {
  //O modal é aberto pelo button
  //Insiro as informações já preenchidas ao modal
  //const recTxtTarefa = document.querySelector('.txtInputTarefa input');
  const dadosPreenchidos = itensDB[i];
  //alert(dadosPreenchidos.item);
  //.categoria
  //.hora  
  document.querySelector('.txtInputTarefa input').value = dadosPreenchidos.item;
  //document.querySelector('.txtInputCategoria select').selected = dadosPreenchidos.categoria;
  document.querySelector('.txtInputCategoria select').value = dadosPreenchidos.categoria;
  document.querySelector('.txtInputHora input').value = dadosPreenchidos.hora;
  document.getElementById('id-edita').value = i;
  //Altero os texto do modal
  document.getElementById('modal-titulo').innerHTML = 'Editar Tarefa';
  document.getElementById('salvar').innerHTML = 'Atualizar Tarefa';
  //itensDB.splice(i, 1)
  //updateDB()

  edita = true;

}




//DATA E RELÓGIO 
var timeDisplay = document.getElementById('relogio');

function refreshTime() {

  var dateString = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  var formattedString = dateString.replace(', ', ' - ');
  timeDisplay.innerHTML = formattedString;
}

setInterval(refreshTime, 1000);


/**************************CRIAÇÃO DAS CATEGORIAS*********************/
const textoCategoria = document.querySelector('.txtCadastroCategoria input')
const btnInsertCategoria = document.querySelector('.divInsertCategoria button')
//const btnDeleteAllCategoria = document.querySelector('.header button')
const ol = document.querySelector('ol');


var itensDBCategorias = []

// btnDeleteAllCategoria.onclick = () => {
//   itensDBCategorias = []
//   updateDBCategorias()
// }

textoCategoria.addEventListener('keypress', e => {
  if (e.key == 'Enter' && textoCategoria.value != '') {
    setItemDBCategorias()
  }
})

btnInsertCategoria.onclick = () => {
  if (textoCategoria.value != '') {
    setItemDBCategorias()
  }
}

function setItemDBCategorias() {
  if (itensDBCategorias.length >= 10) {
    alert('Limite máximo de 10 categorias atingido!')
    return
  }
  itensDBCategorias.push({ 'item': textoCategoria.value, 'status': '' })
  updateDBCategorias()
}

function updateDBCategorias() {
  //Ordena as atividades em ordem alfabética
  itensDBCategorias.sort((a, b) => {
    const itemA = a.item.toString();
    const itemB = b.item.toString();
    return itemA.localeCompare(itemB);
  });
  localStorage.setItem('categorias', JSON.stringify(itensDBCategorias))
  loadItensCategorias();
}

function loadItensCategorias() {
  ol.innerHTML = "";
  itensDBCategorias = JSON.parse(localStorage.getItem('categorias')) ?? []
  itensDBCategorias.forEach((itemCat, i) => {
    insertItemTelaCategorias(itemCat.item, itemCat.status, i)
  })
}

function insertItemTelaCategorias(text, statusCategoria, i) {
  const liCategoria = document.createElement('li');
  //<input type="checkbox" ${statusCategoria} data-i=${i} onchange="doneCategoria(this, ${i});" />
  liCategoria.innerHTML = `
    <div class="divLi">      
      <span data-si=${i}>${text}</span>
      <button onclick="removeItemCategoria(${i})" data-i=${i}><i class='bx bx-trash'></i></button>
    </div>
    `
  ol.appendChild(liCategoria)

  if (statusCategoria) {
    document.querySelector(`[data-si="${i}"]`).classList.add('line-through')
  } else {
    document.querySelector(`[data-si="${i}"]`).classList.remove('line-through')
  }
  textoCategoria.value = ''
}

function doneCategoria(chk, i) {

  if (chk.checked) {
    itensDBCategorias[i].statusCategoria = 'checked'
  } else {
    itensDBCategorias[i].statusCategoria = ''
  }
  updateDBCategorias()
}

function removeItemCategoria(i) {
  itensDBCategorias.splice(i, 1)
  updateDBCategorias()
}

loadItens();//Inicaliza os registros gerais


/***********************EXIBIÇÃO DAS CATEGORIAS NO SELECT***********/


function carregaItensCategorias() {
  limparSelect();
  let itensCategorias = [];
  const selectCategorias = document.getElementById("categoria");
  itensCategorias = JSON.parse(localStorage.getItem('categorias')) ?? []
  itensCategorias.forEach((itensCategorias) => {
    //geraSelectCategorias(itensCategorias.item); 
    option = new Option(itensCategorias.item, itensCategorias.item.toUpperCase());
    selectCategorias.options[selectCategorias.options.length] = option;
  })

}

function limparSelect() {
  // obter o elemento select
  var elem = document.getElementById("categoria");
  // excluir todas as opções exceto a informação para seleção
  elem.options.length = 1;
}


carregaItensCategorias();

const corFundo = localStorage.getItem('back');

if (corFundo) {
  ativaCor(corFundo);
}

function mudaCor() {
  const element = document.querySelector('body');
  let color;
  if (element.classList.contains('bg-dark')) {
    color = 'white';
  } else {
    color = 'black';
  }
  localStorage.setItem('back', color);
  ativaCor(color);
}

function ativaCor(cor) {
  const element = document.querySelector('body');
  if (cor === 'black') {
    console.log(cor);
    element.classList.add('bg-dark');
    element.classList.add('text-white');
    document.getElementById('muda-cor').style.color = 'white';
  } else {
    element.classList.remove('bg-dark');
    element.classList.remove('text-white');
    document.getElementById('muda-cor').style.color = 'black';
  }
}

