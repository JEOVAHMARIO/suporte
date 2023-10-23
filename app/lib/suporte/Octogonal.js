class Octogonal {
    constructor(lado) {
        this.lado = lado;
    }

    calcularArea() {
        const area = 2 * (1 + Math.sqrt(2)) * this.lado * this.lado;
        return area;
    }
}

module.exports = Octogonal;
