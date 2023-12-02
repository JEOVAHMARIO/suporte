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
        let corpo = await utils.getCorpo(req);
        let usuario = await this.suporteDao.autenticar(corpo.nome, corpo.senha);
        if (usuario) {
            console.log({usuario});
            let token = jwt.sign({
                ...usuario
            }, this.SEGREDO_JWT);
            utils.renderizarJSON(res, {
                token,
                mensagem: 'Usuário logado com sucesso!'
            });
        }
        else {
            utils.renderizarJSON(res, {
                mensagem: 'Usuário ou senha inválidos!'
            }, 401);
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

            if (papeisPermitidos.includes(usuario.papel)) {
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