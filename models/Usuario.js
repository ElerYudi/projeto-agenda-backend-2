const { getDb } = require('../database/connection');
const { logError } = require('../utils/logger');
const { ObjectId } = require('mongodb');

class Usuario {
    constructor(nome, email, senha) {
        this.nome = nome;
        this.email = email;
        this.senha = senha; 
    }

    validar() {
        if (!this.email || !this.senha) {
            throw new Error("Campos obrigatórios (email e senha) não foram preenchidos.");
        }
        if (!/\S+@\S+\.\S+/.test(this.email)) {
            throw new Error("O formato do e-mail é inválido.");
        }
        return true;
    }

    async salvar() {
        try {
            this.validar();
            const db = getDb();
            const collection = db.collection('usuarios');
            
            const usuarioExistente = await collection.findOne({ email: this.email });
            if (usuarioExistente) {
                throw new Error("Já existe um usuário cadastrado com este e-mail.");
            }

            const resultado = await collection.insertOne(this);
            return resultado;
        } catch (error) {
            logError(error);
            throw new Error(`Ocorreu um erro ao salvar o usuário: ${error.message}`);
        }
    }

    static async atualizarPorId(id, novosDados) {
        try {
            const db = getDb();
            const collection = db.collection('usuarios');

            for (const key in novosDados) {
                if (novosDados[key] === null || novosDados[key] === undefined) {
                    delete novosDados[key];
                }
            }

            if (novosDados.email) {
                const usuarioExistente = await collection.findOne({ 
                    email: novosDados.email,
                    _id: { $ne: new ObjectId(id) }
                });
                if (usuarioExistente) {
                    throw new Error("O e-mail informado já está em uso por outro usuário.");
                }
            }

            const resultado = await collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: novosDados }
            );
            
            if (resultado.matchedCount === 0) {
                throw new Error("Usuário não encontrado para atualização.");
            }
            
            return resultado;
        } catch (error) {
            logError(error);
            throw new Error(`Ocorreu um erro ao atualizar o usuário: ${error.message}`);
        }
    }

    static async buscarPorId(id) {
        try {
            const db = getDb();
            const collection = db.collection('usuarios');
            return await collection.findOne({ _id: new ObjectId(id) });
        } catch (error) {
            logError(error);
            throw new Error("Ocorreu um erro ao buscar o usuário por ID.");
        }
    }

    static async buscarPorEmail(email) {
       try {
            const db = getDb();
            const collection = db.collection('usuarios');
            return await collection.findOne({ email: email });
        } catch (error) {
            logError(error);
            throw new Error("Ocorreu um erro ao buscar o usuário por e-mail.");
        }
    }

    static async buscarTodos() {
        try {
            const db = getDb();
            const collection = db.collection('usuarios');
            return await collection.find({}).toArray();
        } catch (error) {
            logError(error);
            throw new Error("Ocorreu um erro ao buscar os usuários.");
        }
    }

    static async deletarPorId(id) {
        try {
            const db = getDb();
            const collection = db.collection('usuarios');
            const resultado = await collection.deleteOne({ _id: new ObjectId(id) });
            if (resultado.deletedCount === 0) {
                throw new Error("Usuário não encontrado para deleção.");
            }
            return resultado;
        } catch (error) {
            logError(error);
            throw new Error(`Ocorreu um erro ao deletar o usuário: ${error.message}`);
        }
    }
}

module.exports = Usuario;