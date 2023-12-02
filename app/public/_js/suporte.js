function calcularArea() {
    let inputNome = document.querySelector('[name=nome]');
    let nome = inputNome.value;
    let inputLado = document.querySelector('[name=lado]');
    let lado = parseFloat(inputLado.value);
    let inputPapel = document.querySelector('[name=id_papel]');
    let id_papel = parseFloat(inputPapel.value);

    inserir({
        nome, lado, id_papel
    });
    listar();
}
let traducoes = {
    'pt-BR': {
        'mensagem_senha_em_branco': 'A senha não pode ser em branco!',
        'mensagem_suporte_cadastrado': 'Suporte cadastrado com sucesso!',
        'mensagem_suporte_apagado': 'Suporte apagado com sucesso!'
    },
    'en': {
        'mensagem_senha_em_branco': 'Password cannot be empty!'
    }
}

async function inserir(octogonal){
    console.log('inserindo', octogonal);
    let divResposta = document.querySelector('#resposta');
    let dados = new URLSearchParams(octogonal);
    console.log(dados);
    let resposta = await fetch('octogonais', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: dados
    });
    if (resposta.status == 200) {
        divResposta.classList.add('pequeno');
        divResposta.classList.remove('especial');
    }
    else {
        divResposta.classList.add('especial');
        divResposta.classList.remove('pequeno');
    }
    let respostaJson = await resposta.json();
    let mensagem = respostaJson.mensagem;
    divResposta.innerText = traducoes['pt-BR'][mensagem];
}

async function listar() {
    let divOctogonais = document.querySelector('#octogonais');
    divOctogonais.innerText = 'Carregando...';
    let resposta = await fetch('suportes');
    let Octogonais = await resposta.json();
    divOctogonais.innerHTML = '';
    for (let octogonal of octogonais) {
        let linha = document.createElement('tr');
        let colunaId = document.createElement('td');
        let colunaNome = document.createElement('td');
        let colunalado = document.createElement('td');
        let colunaAcoes = document.createElement('td');
        let botaoEditar = document.createElement('button');
        let botaoApagar = document.createElement('button');
        colunaId.innerText = octogonal.id;
        colunaNome.innerText = octogonal.nome;
        colunalado.innerText = octogonal.lado;
        botaoEditar.innerText = 'Editar';
        botaoEditar.onclick = function () {
            editar(octogonal.id);
        }
        botaoApagar.onclick = function () {
            apagar(octogonal.id);
        }
        botaoApagar.innerText = 'Apagar';
        linha.appendChild(colunaId);
        linha.appendChild(colunaNome);
        linha.appendChild(colunalado);
        colunaAcoes.appendChild(botaoEditar);
        colunaAcoes.appendChild(botaoApagar);
        linha.appendChild(colunaAcoes);
        divSuportes.appendChild(linha);
    }
}

function editar(id) {
    alert('editar' + id);
}

async function apagar(id) {
    let divResposta = document.querySelector('#resposta');
    if (confirm('Quer apagar o #' + id + '?')) {
        let resposta = await fetch('octogonais/' + id, {
            method: 'delete',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        let respostaJson = await resposta.json();
        let mensagem = respostaJson.mensagem;
        divResposta.innerText = traducoes['pt-BR'][mensagem];
        listar();
    }
}

