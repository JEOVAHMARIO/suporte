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
    res.setHeader('Content-Type', 'text/html');
    const responseBody = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
    </head>
    <body>
    <h1>Problema: Cálculo da Área de um Suporte Octogonal!</h1>
    <p><strong>Problema:</strong></p>
    <p>Determine a área de um suporte octogonal. Se a área for menor que 20 metros quadrados, é um suporte pequeno. Se estiver fora desse intervalo, é um suporte especial.</p>
    <form action="/calcular" method="get">
    <label>
    <span>Lado (em metros)</span>
    <input name="lado">
    </label>
    <button>Calcular</button>
    </form>
    </body>
    </html>`;
    res.end(responseBody);
}

function calcularArea(req, res, queryString) {
    const params = new URLSearchParams(queryString);
    const lado = parseFloat(params.get('lado'));

    if (isNaN(lado)) {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 400;
        const errorResponse = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
            </head>
            <body>
                <h1>Erro no Cálculo</h1>
                <p>Lado inválido. Certifique-se de fornecer um número válido.</p>
            </body>
            </html>`;
        res.end(errorResponse);
    } else {
        const area = calcularAreaOctogonal(lado);

        res.setHeader('Content-Type', 'text/html');
        const explanation = area < 20
            ? 'um suporte pequeno.'
            : 'um suporte especial.';

        const responseBody = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
            </head>
            <body>
                <h1>Resultado do Cálculo</h1>
                <p>Lado: ${lado} metros</p>
                <p>Área: ${area.toFixed(2)} metros quadrados</p>
                <p>Explicação do Cálculo: Este é ${explanation}</p>
                <p>Desenvolvido por Jeovah</p>
            </body>
            </html>`;

        res.end(responseBody);
    }
}

function calcularAreaOctogonal(lado) {
    return 2 * (1 + Math.sqrt(2)) * Math.pow(lado, 2);
}

function naoEncontrado(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 404;
    const responseBody = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
    </head>
    <body>
    <h1>Não encontrado!</h1>
    </body>
    </html>`;
    res.end(responseBody);
}

function autor(req, res) {
    res.setHeader('Content-Type', 'text/html');
    const responseBody = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
    </head>
    <body>
    <h1>Autor</h1>
    <p>Nome: Jeovah Mario </p>
    <h2>Formações Acadêmicas</h2>
    <ul><li>Técnico em Eletromecânica</li></ul>
    <h2>Experiências Profissionais</h2>
    <ul>
    <li>Estagiário</li>
    <li>Seção de motores</li>
    <li>Ano: 2020</li>
    </ul>
    <footer>Desenvolvido por Jeovah Mario</footer>
    </body>
    </html>`;
    res.end(responseBody);
}

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
