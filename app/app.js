const http = require('http');
const CalcularController = require('./controllers/CalcularController');
const EstaticoController = require('./controllers/EstaticoController');
const AutorController = require('./controllers/AutorController');

let calcularController = new CalcularController();
let estaticoController = new EstaticoController();
let autorController = new AutorController();

const PORT = 3000;

const server = http.createServer(function (req, res) {
    let [url, queryString] = req.url.split('?');

    if (url === '/index') {
        calcularController.index(req, res);
    } else if (url === '/calcular') {
        if (req.method === 'POST') {
            calcularController.calcularArea(req, res);
        } else {
            naoEncontrado(req, res);
        }
    } else if (url === '/autor') {
        autorController.index(req, res);
    } else {
        estaticoController.naoEncontrado(req, res);
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
