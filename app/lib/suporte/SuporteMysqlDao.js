const Octogonal = require("./Octogonal");
const bcrypt = require('bcrypt');

class SuporteMysqlDao {
    constructor(pool) {
        this.pool = pool;
    }

    listar() {
        return new Promise((resolve, reject) => {
            if (!this.pool) {
                reject('Erro: Conexão com o banco de dados não foi estabelecida.');
                return;
            }

            const query = 'SELECT * FROM octogonais';
            this.pool.query(query, (error, results, fields) => {
                if (error) {
                    reject('Erro: ' + error.message);
                } else {
                    const octogonais = results.map(linha => new Octogonal(linha.nome, linha.lado));
                    resolve(octogonais);
                }
            });
        });
    }

    inserir(octogonal) {
        this.validar(octogonal);
        octogonal.senha = bcrypt.hashSync(octogonal.senha, 10);
        
        return new Promise((resolve, reject) => {
            if (!this.pool) {
                reject('Erro: Conexão com o banco de dados não foi estabelecida.');
                return;
            }
            let sql = `INSERT INTO octogonais (nome, lado, senha, id_papel) VALUES (?, ?, ?, ?);`;
            console.log({ sql }, octogonal);
    
            this.pool.query(sql, [octogonal.nome, octogonal.lado, octogonal.senha, 1], function (error, resultado, fields) {
                if (error) {
                    reject('Erro: ' + error.message);
                } else {
                    // Corrected the variable name to resultado
                    if (resultado.length > 0) {
                        let linha = resultado[0];
                        if (bcrypt.compareSync(octogonal.senha, linha.senha)) {
                            const { nome, lado } = linha;
                            resolve(new Octogonal(nome, lado));
                        } else {
                            resolve(resultado.insertId);
                        }
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }
    

    alterar(id, octogonal) {
        this.validar(octogonal);
        this.octogonais[id] = octogonal;
        return new Promise((resolve, reject) => {
            let sql = 'UPDATE octogonais SET nome=?, lado=? WHERE id=?;';
            this.pool.query(sql, [octogonal.nome, octogonal.lado, id], function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.alterId);
            });
        });
    }

    apagar(id) {
        this.octogonais.splice(id, 1);
        return new Promise((resolve, reject) => {
            let sql = 'DELETE FROM octogonais WHERE id=?;';
            this.pool.query(sql, id, function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.deleteId);
            });
        });
    }

    validar(octogonal) {
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
        return this.listar()
            .then((octogonais) => {
                console.log(nome, senha, octogonais);
                for (let octogonal of octogonais) {
                    console.log(nome, senha, octogonal);
                    if (octogonal.nome === nome && octogonal.senha && bcrypt.compareSync(senha, octogonal.senha)) {
                        return new Octogonal(octogonal.nome, octogonal.lado, octogonal.senha, 'geral');
                    }
                }
                return null;
            })
            .catch((error) => {
                console.error('Erro ao buscar dados para autenticação:', error);
                return null;
            });
    }
    
}

module.exports = SuporteMysqlDao;
