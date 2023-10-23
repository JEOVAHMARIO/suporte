const utils = require('./../lib/utils');
const Octogonal = require('../lib/suporte/Octogonal.js');

class CalcularController {
    index(req, res) {
        utils.renderizarEjs(res, './views/index.ejs');
    }

    calcularArea(req, res) {
        let corpoTexto = '';
        req.on('data', function (pedaco) {
            corpoTexto += pedaco;
        });

        req.on('end', () => {
            const dadosDecodificados = utils.decodificarUrl(corpoTexto);
            const lado = parseFloat(dadosDecodificados.lado);

            if (isNaN(lado)) {
                res.writeHead(400, { 'Content-Type': 'text/html' });
                res.end('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head><body><h1>Erro no Cálculo</h1><p>Comprimento do lado inválido. Certifique-se de fornecer um número válido.</p></body></html>');
            } else {
                const octogonal = new Octogonal(lado);
                const area = octogonal.calcularArea();

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
                        <p>Comprimento do Lado: ${lado} metros</p>
                        <p>Área: ${area.toFixed(2)} metros quadrados</p>
                        <p>Explicação do Cálculo: Este é ${explanation}</p>
                        <p>Desenvolvido por Jeovah</p>
                        <p><strong>Explicação da Fórmula:</strong></p>
                        <p>A fórmula para calcular a área de um suporte octogonal é a seguinte:</p>
                        <p>Área = 2 * (1 + √2) * lado^2</p>
                        <p>Onde:</p>
                        <p>"Área" é a área do suporte octogonal.</p>
                        <p>"lado" é o comprimento de um dos lados do suporte.</p>
                        <p>"√2" representa a raiz quadrada de 2.</p>
                    </body>
                    </html>`;

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(responseBody);
            }
        });
    }
}

module.exports = CalcularController;
