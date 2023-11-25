const http = require('http');
const SuporteController = require('./controllers/SuporteController');
const EstaticoController = require('./controllers/EstaticoController');
const AutorController = require('./controllers/AutorController');
const AuthController = require('./controllers/AuthController');
const SuporteDao = require('./lib//suporte/SuporteDao');
const UsuariosController = require('./controllers/UsuariosControllers');
const UsuariosDao = require('./lib//suporte/UsuariosDao');
const SuporteMysqlDao = require('./lib/suporte/SuporteMysqlDao');
const SuporteDao = require('./lib/suporte/SuporteDao');
const mysql = require('mysql');

const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'bd',
    user            : process.env.MARIADB_USER,
    password        : process.env.MARIADB_PASSWORD,
    database        : process.env.MARIADB_DATABASE
});

let suporteDao = new SuporteDao();
let usuariosDao = new UsuariosDao();
let suporteController = new SuporteController(suporteDao);
let estaticoController = new EstaticoController();
let autorController = new AutorController();
let authController = new AuthController(usuariosDao);
let usuariosController = new UsuariosController(usuariosDao);

const PORT = 3000;
const server = http.createServer((req, res) => {
    let [url, querystring] = req.url.split('?');
    let urlList = url.split('/');
    url = urlList[1];
    let metodo = req.method;

    if (url=='index') {
        suporteController.index(req, res);
    }
    else if (url=='suporte') {
        suporteController.suporte(req, res);
    }

    else if (url == 'suporte' && metodo == 'GET') {
        authController.autorizar(req, res, function() {
            suporteController.listar(req, res);
        }, ['admin', 'geral']);
    }
    else if (url == 'suporte' && metodo == 'POST') {
        authController.autorizar(req, res, function() {
            suporteController.inserir(req, res);
        }, ['admin', 'geral']);
    }
    else if (url == 'suporte' && metodo == 'PUT') {
        authController.autorizar(req, res, function() {
            suporteController.alterar(req, res);
        }, ['admin', 'geral']);
    }
    else if (url == 'suporte' && metodo == 'DELETE') {
        authController.autorizar(req, res, function() {
            suporteController.apagar(req, res);
        }, ['admin']);
    }

    else if (url == 'usuarios' && metodo == 'GET') {
        usuariosController.listar(req, res);
    }
    else if (url == 'usuarios' && metodo == 'POST') {
        usuariosController.inserir(req, res);
    }
    else if (url == 'usuarios' && metodo == 'PUT') {
        authController.autorizar(req, res, function() {
            usuariosController.alterar(req, res);
        }, ['admin', 'geral']);
    }
    else if (url == 'usuarios' && metodo == 'DELETE') {
        authController.autorizar(req, res, function() {
            usuariosController.apagar(req, res);
        }, ['admin']);
    }

    else if (url=='autor') {
        autorController.autor(req, res);    
    }

    else if (url == 'login') {
        authController.index(req, res);
    }
    else if (url == 'logar') {
        authController.logar(req, res);
    }    
    else {
        estaticoController.naoEncontrado(req, res);   
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
