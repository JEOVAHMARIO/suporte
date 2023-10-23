const utils = require("../lib/utils");

class AutorController {
    index(req, res) {
        let autor = {
            nome: 'Jeovah Mario',
            formacoes: ['Técnico em Eletromecânica'],
            experienciaProfissional: [
                {
                    cargo: 'Estagiário',
                    departamento: 'Seção de motores',
                    ano: 2020
                }
            ]
        };

        utils.renderizarEjs(res, './views/autor.ejs', autor);
    }
}

module.exports = AutorController;
