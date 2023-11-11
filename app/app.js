const http = require('http');
const SuporteController = require('./controllers/SuporteController');
const EstaticoController = require('./controllers/EstaticoController');
const AutorController = require('./controllers/AutorController');
const AuthController = require('./controllers/AuthController');
const SuporteDao = require('./lib/suporte/SuporteDao');

let suporteDao = new SuporteDao();
let suporteController = new SuporteController(suporteDao);
let estaticoController = new EstaticoController();
let autorController = new AutorController();
let authController = new AuthController(suporteDao);

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    let [url, queryString] = req.url.split('?');
    let urlList = url.split('/');
    let endpoint = urlList[1];
    let method = req.method;

    if (endpoint === 'index') {
        suporteController.index(req, res);
    } else if (endpoint === 'suporte') {
        if (method === 'GET') {
            suporteController.listar(req, res);
        } else if (method === 'POST') {
            suporteController.inserir(req, res);
        } else if (method === 'PUT') {
            authController.autorizar(req, res, function() {
                suporteController.alterar(req, res);
            }, ['admin', 'geral']); 
        } else if (method === 'DELETE') {
            authController.autorizar(req, res, function() {
                suporteController.apagar(req, res);
            }, ['admin']); 
        } else {
            estaticoController.naoEncontrado(req, res);
        }
    } else if (endpoint === 'login') {
        authController.index(req, res); 
    } else if (endpoint === 'logar') {
        authController.logar(req, res); 
    } else if (endpoint === 'autor') {
        autorController.index(req, res);
    } else {
        estaticoController.naoEncontrado(req, res);
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
