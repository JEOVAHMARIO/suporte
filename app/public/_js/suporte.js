function calcularArea() {
    let inputNome = document.querySelector('[name=nome]');
    let nome = inputNome.value;
    let inputLado = document.querySelector('[name=lado]');
    let lado = parseFloat(inputLado.value);

    let suporte = 2 * lado * lado * (1 + Math.sqrt(2));
    suporte = suporte.toFixed(2);

    let divResposta = document.getElementById('resposta');
    let div = document.createElement('div');
    div.textContent = 'Oi, ' + nome + '! Seu suporte possui lado ' + lado + ' ficou com área ' + suporte;
        
    let tipo = suporte < 20 ? 'pequeno' : 'especial';

    if (tipo === 'pequeno') {
        div.classList.add('pequeno');
        div.classList.remove('especial');
    } else {
        div.classList.remove('pequeno');
        div.classList.add('especial');
    }
    divResposta.appendChild(div);
}