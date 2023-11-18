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
                       
            utils.renderizarEjs(res, './views/area.ejs', octogonal);
        })
    }

    async listar(req, res) {
        try {
            let suporte = await this.suporteDao.listar();
            let dados = [];
    
            for (let octogonal of suporte) {
                const area = octogonal.area;
                const explicacao = octogonal.explicacao;
                dados.push({
                    nome: octogonal.nome,
                    lado: octogonal.lado,
                    calcularArea: area,
                    explicacao: explicacao
                });
            }
    
            utils.renderizarJSON(res, dados);
        } catch (error) {
            utils.renderizarJSON(res, {
                mensagem: 'Erro ao listar suportes: ' + error.message
            }, 500);
        }
    }
    
    async inserir(req, res) {
        try {
            let octogonal = await this.getOctogonalDaRequisicao(req);
    
            if (!octogonal || isNaN(octogonal.lado)) {
                utils.renderizarJSON(res, {
                    mensagem: 'Lado inválido'
                }, 400);
            } else {
                octogonal.id = await this.suporteDao.inserir(octogonal);
    
                const area = octogonal.area;
                const explicacao = octogonal.explicacao;
    
                utils.renderizarJSON(res, {
                    suporte: {
                        id: octogonal.id, // Include the ID in the response
                        nome: octogonal.nome,
                        lado: octogonal.lado,
                        senha: octogonal.senha,
                        papel: octogonal.papel,
                        area: area,
                        explicacao: explicacao,
                        tipo: octogonal.tipo
                    },
                    mensagem: 'mensagem_suporte_cadastrado'
                });
            }
        } catch (error) {
            // Handle the error, e.g., log it or send an error response
            console.error('Error during inserir:', error);
            utils.renderizarJSON(res, {
                mensagem: 'Erro durante a inserção'
            }, 500);
        }
    }
    

    async alterar(req, res) {
        let octogonal = await this.getOctogonalDaRequisicao(req);
        let [url, queryString] = req.url.split('?');
        let urlList = url.split('/');
        let endpoint = urlList[1];
        let id = urlList[2];
        try {
            this.suporteDao.alterar(id, octogonal);
            utils.renderizarJSON(res, {
                mensagem: 'mensagem_suporte_alterado'
            });
        } catch (e) {
            utils.renderizarJSON(res, {
                mensagem: 'Lado inválido'
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
            corpo.senha,
            corpo.papel
        );
        return octogonal;
    }
}

module.exports = SuporteController;
