const http = require('http');

const PORT = 3000;
const server = http.createServer(function (req, res) {
    let [url, queryString] = req.url.split('?');

    if (url === '/index') {
        index(req, res);
    } else if (url === '/calcular') {
        calcularArea(req, res, queryString);
    } else if (url === '/autor') {
        autor(req, res);
    } else {
        naoEncontrado(req, res);
    }
});

function index(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
    </head>
    <body>`);
    res.write('<h1>Problema: Cálculo da Área de um Suporte Octogonal!</h1>');
    res.write('<p><strong>Problema:</strong></p>');
    res.write('<p>Determine a área de um suporte octogonal. Se a área for menor que 20 metros quadrados, é um suporte pequeno. Se estiver fora desse intervalo, é um suporte especial.</p>');
    res.write('<form action="/calcular" method="get">');
    res.write('<label>');
    res.write('<span>Lado (em metros)</span>');
    res.write('<input name="lado">');
    res.write('</label>');
    res.write('<button>Calcular</button>');
    res.write('</form>');
    res.write(`</body>
    </html>`);
    res.end();
}

function calcularArea(req, res, queryString) {
    const params = new URLSearchParams(queryString);
    const lado = parseFloat(params.get('lado'));

    if (isNaN(lado)) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Lado inválido. Certifique-se de fornecer um número válido.');
    } else {
        const area = calcularAreaOctogonal(lado);

        res.writeHead(200, { 'Content-Type': 'text/plain' });

        if (area < 20) {
            res.end(`Lado: ${lado} metros\nÁrea: ${area.toFixed(2)} metros quadrados\nExplicação do Cálculo: um suporte pequeno.\n\nDesenvolvido por Jeovah`);
        } else {
            res.end(`Lado: ${lado} metros\nÁrea: ${area.toFixed(2)} metros quadrados\nExplicação do Cálculo: um suporte especial.\n\nDesenvolvido por Jeovah`);
        }
    }
}

function calcularAreaOctogonal(lado) {
    // Calcular a área de um suporte octogonal
    // Fórmula: 2 * (1 + Math.sqrt(2)) * lado^2
    return 2 * (1 + Math.sqrt(2)) * Math.pow(lado, 2);
}

server.on('request', (req, res) => {
    const [url, queryString] = req.url.split('?');

    if (url === '/calcular') {
        calcularArea(req, res, queryString);
    }
});

function naoEncontrado(req, res) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.write(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
    </head>
    <body>`);
    res.write('<h1>Não encontrado!</h1>');
    res.write(`</body>
    </html>`);
    res.end();
}

function autor(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
    </head>
    <body>`);
    res.write('<h1>Autor</h1>');
    res.write('<p>Nome: Jeovah Mario </p>');
    res.write('<h2>Formações Acadêmicas</h2>');
    res.write('<ul><li>Técnico em Eletromecânica</li></ul>');
    res.write('<h2>Experiências Profissionais</h2>');
    res.write('<ul>');
    res.write('<li>Estagiário</li>');
    res.write('<li>Seção de motores</li>');
    res.write('<li>Ano: 2020</li>');
    res.write('</ul>');
    res.write('<footer>Desenvolvido por Jeovah Mario</footer>');
    res.write(`</body>
    </html>`);
    res.end();
}

server.listen(PORT, () => {
    console.log(`Servidor ouvindo na porta ${PORT}`);
});
