//Crio uma constante que lê os seletores input
//Atividade
const texto = document.querySelector('.txtInputTarefa input');
//Categoria
const categoria = document.querySelector('.txtInputCategoria input');
//hora
const hora = document.querySelector('.txtInputHora input');

let edita = false;

//Pego o clique no + para editar texto do modal
const btnAbreModal = document.getElementById('addTarefa');
btnAbreModal.onclick = () => {
  document.getElementById('modal-titulo').innerHTML = 'Nova Tarefa';
  document.getElementById('salvar').innerHTML = 'Salvar';
  document.querySelector('.txtInputTarefa input').value = '';
  document.querySelector('.txtInputCategoria input').value = '';
  document.querySelector('.txtInputHora input').value = '';
  edita = false;
}

//Lê dentro da class .divInsert o atributo button
// const btnInsert = document.querySelector('.divInsert button');
const btnInsert = document.querySelector('.modal-footer button');

//Delete All - Lê dentro da classe header o atributo button
const btnDeleteAll = document.querySelector('.footer button');

//Leio todos as listas (atentar para que se usar outra lista ordenada agrupar por classe ou dentro de algum id)
const ul = document.querySelector('ul');

//Inicaliza a variável ítensDB como um array
//Observar que ela fica como var para ser usada no escopo de funções posteriores
var itensDB = []

//Ação de deletar todos os registros
//O delete apenas registra o valor vazio no array
btnDeleteAll.onclick = () => {
  itensDB = []
  updateDB();
}

//Ação ao pressionar tecla. apenas tecla enter está configurada
texto.addEventListener('keypress', e => {
  if (e.key == 'Enter' && texto.value != '') {
    setItemDB()
  }
})


//Ação ao clicar botão btnInsert
btnInsert.onclick = () => {
  //Analiso se o conteúdo do botão é diferente de vazio
  if (texto.value != '') {
    setItemDB();//Seta itemDB
    //Verifico se é update, caso seja apago o item anterior    
    if (edita) {
      const i = document.getElementById('id-edita').value;      
      removeItem(i);
    }    
  }
}

//Inserir ítem no LS
function setItemDB() {
  if (itensDB.length >= 20) {//Limita em 20 as atividades
    alert('Limite máximo de 20 itens atingido!');
    return
  }

  //Adiciona um ítem ao array  
  itensDB.push({ 'item': texto.value, 'categoria': categoria.value, hora: hora.value, 'status': '' })
  updateDB();
}


//Atualizo Local Storage com os dados armazenados no itensDB
function updateDB() {
  localStorage.setItem('todolist', JSON.stringify(itensDB))
  loadItens();
}

function loadItens() {
  ul.innerHTML = "";
  itensDB = JSON.parse(localStorage.getItem('todolist')) ?? [];
  if(itensDB.length > 0){
    document.getElementById('footer-trash').style.display = 'block';
  }else{
    document.getElementById('footer-trash').style.display = 'none';
  }
  itensDB.forEach((item, i) => {
    insertItemTela(item.item, item.categoria, item.hora, item.status, i);
  })
}

//Inserir ítem na tela
function insertItemTela(text, categoria, hora, status, i) {

  const li = document.createElement('li');

  li.innerHTML = `
    <div class="divLi">
      <input type="checkbox" ${status} data-i=${i} onchange="done(this, ${i});" />
      <span data-si=${i}>${text}</span>
      <span>${categoria}</span>
      <span>${hora}</span>
      <button onclick="editaItem(${i})" data-bs-toggle="modal" data-bs-target="#modal" data-i=${i}><i class='bx bx-edit'></i></button>
      <button onclick="removeItem(${i})" data-i=${i}><i class='bx bx-trash'></i></button>
    </div>
    `;
  //Adiciona uma ul ao final da lista
  ul.appendChild(li);

  //Linha riscada - Atividade Concluída
  if (status) {
    document.querySelector(`[data-si="${i}"]`).classList.add('line-through')
  } else {
    document.querySelector(`[data-si="${i}"]`).classList.remove('line-through')
  }

  texto.value = ''
}

function done(chk, i) {

  if (chk.checked) {
    itensDB[i].status = 'checked'
  } else {
    itensDB[i].status = ''
  }

  updateDB()
}

function removeItem(i) {
  itensDB.splice(i, 1)//Alterar conteúdo do array e reordenar o mesmo
  updateDB()
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
  document.querySelector('.txtInputCategoria input').value = dadosPreenchidos.categoria;
  document.querySelector('.txtInputHora input').value = dadosPreenchidos.hora;
  document.getElementById('id-edita').value = i;
  //Altero os texto do modal
  document.getElementById('modal-titulo').innerHTML = 'Editar Tarefa';
  document.getElementById('salvar').innerHTML = 'Atualizar Tarefa';
  //itensDB.splice(i, 1)
  //updateDB()

  edita = true;

}

loadItens();//Inicaliza os registros


//DATA E RELÓGIO 
var timeDisplay = document.getElementById('relogio');

function refreshTime() {

  var dateString = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  var formattedString = dateString.replace(', ', ' - ');
  timeDisplay.innerHTML = formattedString;
}

setInterval(refreshTime, 1000);