const { getDb } = require('../database/connection');
const { logError } = require('../utils/logger');
const { ObjectId } = require('mongodb');

class Categoria {
    constructor(nome = null, descricao = '') {
        this.nome = nome;
        this.descricao = descricao;
        this.criadoEm = new Date();
    }

    validar() {
        if (!this.nome) {
            throw new Error("O campo 'nome' da categoria é obrigatório.");
        }
        return true;
    }

    async salvar() {
        try {
            this.validar();
            const db = getDb();
            const collection = db.collection('categorias');

            const categoriaExistente = await collection.findOne({ nome: this.nome });
            if (categoriaExistente) {
                throw new Error("Já existe uma categoria com este nome.");
            }

            const resultado = await collection.insertOne(this);
            return resultado;
        } catch (error) {
            logError(error);
            throw new Error(`Ocorreu um erro ao salvar a categoria: ${error.message}`);
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

    static async buscarTodos() {
        try {
            const db = getDb();
            return await db.collection('categorias').find({}).toArray();
        } catch (error) {
            logError(error);
            throw new Error("Ocorreu um erro ao buscar as categorias.");
        }
    }

    static async deletarPorId(id) {
        try {
            const db = getDb();
            const resultado = await db.collection('categorias').deleteOne({ _id: new ObjectId(id) });
            if (resultado.deletedCount === 0) {
                throw new Error("Categoria não encontrada para deleção.");
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
                if (categoriaExistente) {
                    throw new Error("Já existe uma categoria com este nome.");
                }
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