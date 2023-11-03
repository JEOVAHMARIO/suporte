const http = require('http');
const SuporteController = require('./controllers/SuporteController');
const EstaticoController = require('./controllers/EstaticoController');
const AutorController = require('./controllers/AutorController');
const SuporteDao = require('./lib/suporte/SuporteDao');

const suporteDao = new SuporteDao();
const suporteController = new SuporteController(suporteDao);
const estaticoController = new EstaticoController();
const autorController = new AutorController();

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    const [url, queryString] = req.url.split('?');
    const urlList = url.split('/');
    const endpoint = urlList[1];
    const method = req.method;

    if (endpoint === 'index') {
        suporteController.index(req, res);
    } else if (endpoint === 'suporte') {
        if (method === 'GET') {
            suporteController.listar(req, res);
        } else if (method === 'POST') {
            suporteController.inserir(req, res);
        } else if (method === 'PUT') {
            suporteController.alterar(req, res);
        } else if (method === 'DELETE') {
            suporteController.apagar(req, res);
        } else {
            estaticoController.naoEncontrado(req, res);
        }
    } else if (endpoint === 'autor') {
        autorController.index(req, res);
    } else {
        estaticoController.naoEncontrado(req, res);
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
