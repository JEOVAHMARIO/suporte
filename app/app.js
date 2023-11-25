const http = require('http');
const SuporteController = require('./controllers/SuporteController');
const EstaticoController = require('./controllers/EstaticoController');
const AutorController = require('./controllers/AutorController');
const AuthController = require('./controllers/AuthController');
const SuporteMysqlDao = require('./lib/suporte/SuporteMysqlDao');
const SuporteDao = require('./lib/suporte/SuporteDao');
const UsuariosController = require('./controllers/UsuariosController');
const UsuariosDao = require('./lib/suporte/UsuariosDao');
const UsuariosMysqlDao = require('./lib/suporte/UsuariosMysqlDao');
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'bd',
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE
});

let suporteDao = new SuporteMysqlDao(pool);
let usuariosDao = new UsuariosMysqlDao(pool);
let suporteController = new SuporteController(suporteDao);
let estaticoController = new EstaticoController();
let autorController = new AutorController();
let authController = new AuthController(usuariosDao);
let usuariosController = new UsuariosController(usuariosDao);

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
            authController.autorizar(req, res, function () {
                suporteController.alterar(req, res);
            }, ['admin', 'geral']);
        } else if (method === 'DELETE') {
            authController.autorizar(req, res, function () {
                suporteController.apagar(req, res);
            }, ['admin']);
        } else {
            estaticoController.naoEncontrado(req, res);
        }
    } else if (endpoint === 'usuarios' && method === 'GET') {
        usuariosController.listar(req, res);
    } else if (endpoint === 'usuarios' && method === 'POST') {
        usuariosController.inserir(req, res);
    } else if (endpoint === 'usuarios' && method === 'PUT') {
        authController.autorizar(req, res, function () {
            usuariosController.alterar(req, res);
        }, ['admin', 'geral']);
    } else if (endpoint === 'usuarios' && method === 'DELETE') {
        authController.autorizar(req, res, function () {
            usuariosController.apagar(req, res);
        }, ['admin']);
    } else if (endpoint === 'login') {
        authController.index(req, res);
    } else if (endpoint === 'logar') {
        authController.logar(req, res);
    } else if (endpoint === 'autor') {
        autorController.index(req, res);
    } else {
        estaticoController.procurar(req, res);
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
