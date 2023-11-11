class Octogonal {
    constructor(nome, lado, senha, papel) {
        this.nome = nome;
        this.lado = parseFloat(lado);
        this.senha = senha;
        this.papel = papel;
        this.calcularArea();
    }

    calcularArea() {
        if (!isNaN(this.lado)) {
            this.area = 2 * this.lado * this.lado * (1 + Math.sqrt(2));
            this.explicacao = this.area < 20 ? 'um suporte pequeno.' : 'um suporte especial.';
            this.tipo = this.area < 20 ? 'pequeno' : 'especial';
        } else {
            this.area = 0;
            this.explicacao = 'Comprimento do lado inválido.';
            this.tipo = 'desconhecido';
        }
    }

    setLado(lado) {
        this.lado = parseFloat(lado);
        this.calcularArea();
    }
}

module.exports = Octogonal;
