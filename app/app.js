const http = require('http');
const SuporteController = require('./controllers/SuporteController');
const EstaticoController = require('./controllers/EstaticoController');
const AutorController = require('./controllers/AutorController');
const SuporteDao = require('./lib/suporte/SuporteDao');

let suporteDao = new SuporteDao();
let suporteController = new SuporteController(suporteDao);
let estaticoController = new EstaticoController();
let autorController = new AutorController();

const PORT = 3000;
const server = http.createServer((req, res) => {
    let [url, querystring] = req.url.split('?');
    let urlList = url.split('/');
    url = urlList[1];
    let metodo = req.method;

    if (url=='index') {
        suporteController.index(req, res);
    }
    else if (url=='area') {
        suporteController.area(req, res);
    }

    else if (url == 'suporte' && metodo == 'GET') {
        suporteController.listar(req, res);
    }
    else if (url == 'suporte' && metodo == 'POST') {
        suporteController.inserir(req, res);
    }
    else if (url == 'suporte' && metodo == 'PUT') {
        suporteController.alterar(req, res);
    }
    else if (url == 'suporte' && metodo == 'DELETE') {
        suporteController.apagar(req, res);
    }

    else if (url=='autor') {
        autorController.autor(req, res);    
    }
    else {
        estaticoController.naoEncontrado(req, res);   
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
