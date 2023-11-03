const utils = require('./../lib/utils');
const Octogonal = require('./../lib/suporte/Octogonal');
const SuporteDao = require('./../lib/suporte/SuporteDao');

class SuporteController {
    constructor() {
        this.suporteDao = new SuporteDao();
    }

    index(req, res) {
        utils.renderizarEjs(res, './views/index.ejs');
    }

    async calcularArea(req, res) {
        let corpoTexto = '';

        req.on('data', function (pedaco) {
            corpoTexto += pedaco;
        });

        req.on('end', () => {
            const { lado } = utils.decodificarUrl(corpoTexto);

            if (isNaN(lado)) {
                res.writeHead(400, { 'Content-Type': 'text/html' });
                res.end('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head><body><h1>Erro no Cálculo</h1><p>Comprimento do lado inválido. Certifique-se de fornecer um número válido.</p></body></html>');
            } else {
                const octogonal = new Octogonal("Suporte X", lado);
                octogonal.tipo = octogonal.area < 20 ? 'pequeno' : 'especial';

                const area = octogonal.area;
                const explicacao = octogonal.explicacao;

                let resultado = {
                    area: area,
                    explicacao: explicacao,
                    tipo: octogonal.tipo
                };

                utils.renderizarEjs(res, './views/calculo.ejs', resultado);
            }
        });
    }

    async listar(req, res) {
        let suporte = this.suporteDao.listar();
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
    }

    async inserir(req, res) {
        const octogonal = await this.getOctogonalDaRequisicao(req);
    
        if (!octogonal || isNaN(octogonal.lado)) {
            utils.renderizarJSON(res, {
                mensagem: 'Lado inválido'
            }, 400);
        } else {
            this.suporteDao.inserir(octogonal);
            const area = octogonal.area;
            const explicacao = octogonal.explicacao;
    
            utils.renderizarJSON(res, {
                suporte: {
                    nome: octogonal.nome,
                    lado: octogonal.lado,
                    area: area,
                    explicacao: explicacao,
                    tipo: octogonal.tipo
                },
                mensagem: 'mensagem_suporte_cadastrado'
            });
        }
    }

    async alterar(req, res) {
        let octogonal = await this.getOctogonalDaRequisicao(req);
        const [url, queryString] = req.url.split('?');
        const urlList = url.split('/');
        const endpoint = urlList[1];
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
        const [url, queryString] = req.url.split('?');
        const urlList = url.split('/');
        const endpoint = urlList[1];
        let id = urlList[2];
        this.suporteDao.apagar(id);
        utils.renderizarJSON(res, {
            mensagem: 'mensagem_suporte_apagado',
            id: id
        });
    }

    async getOctogonalDaRequisicao(req) {
        const corpoJSON = await utils.getCorpo(req);
        if (corpoJSON && !isNaN(corpoJSON.lado)) {
            const octogonal = new Octogonal("Suporte []", corpoJSON.lado);
            octogonal.tipo = octogonal.area < 20 ? 'pequeno' : 'especial';
            return octogonal;
        } else {
            return null;
        }
    }
}

module.exports = SuporteController;
