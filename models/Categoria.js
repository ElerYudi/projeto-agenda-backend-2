const { getDb } = require('../database/connection');
const { logError } = require('../utils/logger');
const { ObjectId } = require('mongodb');

class Categoria {
    constructor(nome, usuarioId, descricao = '') {
        this.nome = nome;
        this.usuarioId = new ObjectId(usuarioId);
        this.descricao = descricao;
        this.criadoEm = new Date();
    }

    validar() {
        if (!this.nome || !this.usuarioId) {
            throw new Error("O campo 'nome' e 'usuarioId' são obrigatórios.");
        }
        return true;
    }

    async salvar() {
        try {
            this.validar();
            const db = getDb();
            const collection = db.collection('categorias');

            const categoriaExistente = await collection.findOne({ 
                nome: this.nome, 
                usuarioId: this.usuarioId
            });
            if (categoriaExistente) {
                throw new Error("Você já possui uma categoria com este nome.");
            }

            const resultado = await collection.insertOne(this);
            return resultado;
        } catch (error) {
            logError(error);
            throw new Error(`Ocorreu um erro ao salvar a categoria: ${error.message}`);
        }
    }

    static async buscarTodos() {
        try {
            const db = getDb();
            return await db.collection('categorias').find({}).toArray();
        } catch (error) {
            logError(error);
            throw new Error("Ocorreu um erro ao buscar as categorias.");
        }
    }

    static async buscarPorUsuario(usuarioId) {
        try {
            const db = getDb();
            return await db.collection('categorias')
                .find({ usuarioId: new ObjectId(usuarioId) })
                .toArray();
        } catch (error) {
            logError(error);
            throw new Error("Ocorreu um erro ao buscar as categorias do usuário.");
        }
    }

    static async buscarPorId(id) {
        try {
            const db = getDb();
            const categoria = await db.collection('categorias').findOne({ _id: new ObjectId(id) });
            return categoria;
        } catch (error) {
            logError(error);
            throw new Error("Ocorreu um erro ao buscar a categoria.");
        }
    }

    static async deletarPorId(id) {
        try {
            const db = getDb();
            const resultado = await db.collection('categorias').deleteOne({ _id: new ObjectId(id) });
            if (resultado.deletedCount === 0) {
                throw new Error("Categoria não encontrada for deleção.");
            }
            return resultado;
        } catch (error) {
            logError(error);
            throw new Error(`Ocorreu um erro ao deletar a categoria: ${error.message}`);
        }
    }

    static async atualizarPorId(id, novosDados) {
        try {
            const db = getDb();
            const collection = db.collection('categorias');
            
            if (novosDados.nome) {
                 const categoriaExistente = await collection.findOne({ 
                    nome: novosDados.nome,
                    _id: { $ne: new ObjectId(id) }
                });
            }

            const resultado = await collection.updateOne({ _id: new ObjectId(id) }, { $set: novosDados });
            if (resultado.matchedCount === 0) {
                throw new Error("Categoria não encontrada para atualização.");
            }
            return resultado;
        } catch (error) {
            logError(error);
            throw new Error(`Ocorreu um erro ao atualizar a categoria: ${error.message}`);
        }
    }
}

module.exports = Categoria;