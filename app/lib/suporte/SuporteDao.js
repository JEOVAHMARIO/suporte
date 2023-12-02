const Octogonal = require("./Octogonal");
const bcrypt = require('bcrypt');

class SuporteDao {
    constructor() {
        this.octogonais = [];
    }

    listar() {
        return this.octogonais;
    }

    inserir(octogonal) {
        this.validar(octogonal);
        octogonal.senha = bcrypt.hashSync(octogonal.senha, 10);
        this.octogonais.push(octogonal);
    }

    alterar(id, octogonal) {
        this.validar(octogonal);
        this.octogonais[id] = octogonal;
    }

    apagar(id) {
        this.octogonais.splice(id, 1);
    }

    validar(octogonal) {
        if (octogonal.nome === '') {
            throw new Error('mensagem_nome_em_branco');
        }
        if (octogonal.lado < 0) {
            throw new Error('mensagem_tamanho_invalido');
        }
    }

    autenticar(nome, senha) {
        for (let octogonal of this.listar()) {
            if (octogonal.nome === nome && bcrypt.compareSync(senha, octogonal.senha)) {
                return octogonal;
            }
        }
        return null;
    }
}

module.exports = SuporteDao;
