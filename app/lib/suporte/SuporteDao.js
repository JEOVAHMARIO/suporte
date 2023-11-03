class SuporteDao {
    constructor() {
        this.octogonais = [];
    }

    listar() {
        return this.octogonais;
    }

    inserir(octogonal) {
        if (!octogonal || isNaN(octogonal.lado) || octogonal.lado <= 0) {
            return false;
        }
        this.octogonais.push(octogonal);
        return true; 
    }

    alterar(id, octogonal) {
        if (id >= 0 && id < this.octogonais.length) {
            this.validar(octogonal);
            this.octogonais[id] = octogonal;
            return true; 
        } else {
            return false;
        }
    }

    apagar(id) {
        if (id >= 0 && id < this.octogonais.length) {
            this.octogonais.splice(id, 1);
            return true; 
        } else {
            return false; 
        }
    }

    validar(octogonal) {
        if (octogonal.lado < 0) {
            throw new Error('Lado do octogonal não pode ser menor que 0');
        }
    }
}

module.exports = SuporteDao;
