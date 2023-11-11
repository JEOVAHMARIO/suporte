
const Octogonal = require("./Octogonal")
const bcrypt = require('bcrypt')

class SuporteDao {
    constructor() {
        this.octogonais = [];
    }

    listar() {
        return this.octogonais;
    }

    inserir(octogonal) {
        console.log(1);
        if (!octogonal || isNaN(octogonal.lado) || octogonal.lado <= 0 || !octogonal.nome || !octogonal.senha ) {
            return false;
        }
        octogonal.senha = bcrypt.hashSync(octogonal.senha, 10);
        this.octogonais.push(octogonal);

        return true;
    }

    alterar(id, octogonal) {
        this.validar(octogonal);
        this.octogonais[id] = octogonal;
    }

    apagar(id) {
        this.octogonais.splice(id, 1);
    }

    validar(octogonal) {
        console.log(2, octogonal);
        if (!octogonal.nome) {
            throw new Error('mensagem_nome_em_branco');
        }
        if (!octogonal.senha) {
            throw new Error('mensagem_senha_em_branco');
        }
        if (octogonal.lado < 0) {
            throw new Error('Lado do octogonal não pode ser menor que 0');
        }
    }

    autenticar(nome, senha) {
        console.log(nome, senha, this.listar());
        for (let octogonal of this.listar()) {
            console.log(nome, senha,octogonal );
            if (octogonal.nome === nome && bcrypt.compareSync(
                senha, octogonal.senha)) {
                    return octogonal;
                }
        }
        return null;
    }
}

module.exports = SuporteDao;
