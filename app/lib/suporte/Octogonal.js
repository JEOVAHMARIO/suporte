class Octogonal {
    constructor(nome, lado) {
        this.nome = nome;
        this.lado = lado;
        this.area = this.calcularArea();
        this.explicacao = this.area < 20 ? 'um suporte pequeno.' : 'um suporte especial.';
        this.tipo = 'desconhecido';
    }

    calcularArea() {
        return 2 * this.lado * this.lado * (1 + Math.sqrt(2));
    }
    setLado(lado) {
        this.lado = lado;
        this.area = this.calcularArea();
        this.explicacao = this.area < 20 ? 'um suporte pequeno.' : 'um suporte especial.';
    }
}

module.exports = Octogonal;
