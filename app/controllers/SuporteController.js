const utils = require('./../lib/utils');
const Octogonal = require('./../lib/suporte/Octogonal');

class SuporteController {
    constructor(suporteDao) {
        this.suporteDao = suporteDao;
        this.SEGREDO_JWT = process.env.SEGREDO_JWT;
    }

    index(req, res) {
        utils.renderizarEjs(res, './views/index.ejs');
    }

    async calcularArea(req, res){               
        let corpoTexto ='';
        req.on('data', function (pedaco) {
            corpoTexto += pedaco;
        });
        req.on('end', () => {
            let propriedades = corpoTexto.split('&');
            let query = {};
            for (let propriedade of propriedades) {
                let [variavel, valor] = propriedade.split('=');
                query[variavel] = valor;
            }
            let octogonal = new Octogonal();
            octogonal.nome = query.nome;
            octogonal.lado = parseFloat(query.lado);

       
            utils.renderizarEjs(res, './views/suporte.ejs', octogonal);
        })
    }
    
    async listar(req, res) {
        let octogonais = await this.suporteDao.listar();
        let dados = octogonais.map(octogonal => {
            return {
                ...octogonal,
                area: octogonal.calcularArea(),
            };
        });

        utils.renderizarJSON(res, dados);
    }
    
    async inserir(req, res) {
        let octogonal = await this.getOctogonalDaRequisicao(req);
        try {
            octogonal.id = await this.suporteDao.inserir(octogonal);
            utils.renderizarJSON(res, {
                octogonal: {
                    ...octogonal,
                    area: octogonal.calcularArea(),
                },
                mensagem: 'mensagem_suporte_cadastrado'
            });
        } catch (e) {
            utils.renderizarJSON(res, {
                mensagem: e.message
            }, 400);
        }
    }

    async alterar(req, res) {
        let octogonal = await this.getOctogonalDaRequisicao(req);
        let [ url, queryString ] = req.url.split('?');
        let urlList = url.split('/');
        url = urlList[1];
        let id = urlList[2];
        try {
            this.suporteDao.alterar(id, octogonal);
            utils.renderizarJSON(res, {
                mensagem: 'mensagem_suporte_alterado'
            });
        } catch (e) {
            utils.renderizarJSON(res, {
                mensagem: e.message
            }, 400);
        }
    }
    
    apagar(req, res) {
        let [url, queryString] = req.url.split('?');
        let urlList = url.split('/');
        url = urlList[1];
        let id = urlList[2];
        this.suporteDao.apagar(id);
        utils.renderizarJSON(res, {
            mensagem: 'mensagem_suporte_apagado',
            id: id
        });
    }

    async getOctogonalDaRequisicao(req) {
        let corpo = await utils.getCorpo(req);
        let octogonal = new Octogonal(
            corpo.nome,
            parseFloat(corpo.lado),
            corpo.papel
        );
        return octogonal;
    }
}

module.exports = SuporteController;
