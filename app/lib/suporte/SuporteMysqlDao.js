const Octogonal = require("./Octogonal");
const bcrypt = require('bcrypt');

class SuporteMysqlDao {
    constructor(pool) {
        this.pool = pool;
    }
    
    listar() {
        return new Promise((resolve, reject) => {
            this.pool.query('SELECT * FROM octogonais', function (error, linhas, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                let octogonais = linhas.map(linha => {
                    let { nome, lado, senha, papel } = linha;
                    return new Octogonal(nome, lado, senha, papel);
                })
                resolve(octogonais);
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
        if (octogonal.lado < 0) {
            throw new Error('Lado do octogonal não pode ser menor que 0');
        }
    }
    
    autenticar(nome, senha) {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM octogonais WHERE nome=?';
            this.pool.query(sql, [nome, senha], function (error, linhas, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                for (let linha of linhas) {
                    console.log('autenticar', senha, linha);
                    if (bcrypt.compareSync(senha, linha.senha)) {
                        let { nome, lado, senha, papel } = linha;
                        return resolve(new Octogonal(nome, lado, senha, papel));
                    }
                }
                return resolve(null);
            });
        });
    }
} 
module.exports = SuporteMysqlDao; 