const utils = require("../lib/utils");
const jwt = require('jsonwebtoken');

class AuthController {
    constructor(suporteDao) {
        this.suporteDao = suporteDao;
        this.SEGREDO_JWT = process.env.SEGREDO_JWT;
    }

    index(req, res) {
        utils.renderizarEjs(res, './views/login.ejs');
    }

    async logar(req, res) {
        try {
            let corpo = await utils.getCorpo(req);
            let usuario = await this.suporteDao.autenticar(corpo.nome, corpo.senha);
    
            if (usuario) {
                let token = jwt.sign({
                    nome: usuario.nome,
                    lado: usuario.lado,
                    papel: usuario.papel
                }, this.SEGREDO_JWT);
    
                utils.renderizarJSON(res, {
                    token,
                    mensagem: 'Usuário logado com sucesso!'
                });
            } else {
                utils.renderizarJSON(res, {
                    mensagem: 'Usuário ou senha inválidos!'
                }, 401);
            }
        } catch (error) {
            console.error('Erro ao realizar login:', error);
            utils.renderizarJSON(res, {
                mensagem: 'Erro ao realizar login.'
            }, 500);
        }
    }
    
    

    // middleware
    autorizar(req, res, proximoControlador, papeisPermitidos) {
        console.log('autorizando', req.headers);
        let token = req.headers.authorization.split(' ')[0];
        console.log(token);
        console.log(this.SEGREDO_JWT);
        try {
            let usuario = jwt.verify(token, this.SEGREDO_JWT);
            req.usuario = usuario;
            console.log({usuario}, papeisPermitidos);

            if (papeisPermitidos.includes(usuario.papel) || papeisPermitidos.length == 0) {
                proximoControlador();
            }
            else {
                utils.renderizarJSON(res, {
                    mensagem: 'Não autorizado!'
                }, 403);
            }

        } catch (e) {
            utils.renderizarJSON(res, {
                mensagem: 'Não autenticado!'
            }, 401);
        }

    }
}

module.exports = AuthController;