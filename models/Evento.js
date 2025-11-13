const { getDb } = require('../database/connection');
const { logError } = require('../utils/logger');
const { ObjectId } = require('mongodb');

class Evento {
    constructor(titulo, dataInicio, dataFim, usuarioId, categoriaId, descricao = '', local = '') {
        this.titulo = titulo;
        this.descricao = descricao;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.local = local;
        this.usuarioId = new ObjectId(usuarioId);
        this.categoriaId = new ObjectId(categoriaId);
        this.criadoEm = new Date();
    }

    validar() {
        if (!this.titulo || !this.dataInicio || !this.dataFim || !this.usuarioId || !this.categoriaId) {
            throw new Error("Campos obrigatórios (título, datas, IDs de usuário e categoria) não foram preenchidos.");
        }
        if (this.dataInicio > this.dataFim) {
            throw new Error("A data de início não pode ser posterior à data de fim.");
        }
        return true;
    }

    async salvar() {
        try {
            this.validar();
            const db = getDb();
            const resultado = await db.collection('eventos').insertOne(this);
            return resultado;
        } catch (error) {
            logError(error);
            throw new Error(`Ocorreu um erro ao salvar o evento: ${error.message}`);
        }
    }

    static async buscarTodos() {
        try {
            const db = getDb();
            return await db.collection('eventos').find({}).toArray();
        } catch (error) {
            logError(error);
            throw new Error("Ocorreu um erro ao buscar os eventos.");
        }
    }

    static async buscarPorUsuarioFiltro(usuarioId, categoriaId) {
        try {
            const db = getDb();
            const filtro = { usuarioId: new ObjectId(usuarioId) };

            if (categoriaId && categoriaId !== 'todos') {
                filtro.categoriaId = new ObjectId(categoriaId);
            }

            return await db.collection('eventos').find(filtro).toArray();
            
        } catch (error) {
            logError(error);
            throw new Error("Ocorreu um erro ao buscar eventos por usuário.");
        }
    }
    
    static async buscarPorId(id) {
        try {
            const db = getDb();
            const evento = await db.collection('eventos').findOne({ _id: new ObjectId(id) });
            return evento;
        } catch (error) {
            logError(error);
            throw new Error("Ocorreu um erro ao buscar o evento.");
        }
    }

    static async buscarPorUsuario(usuarioId) {
        try {
            const db = getDb();
            return await db.collection('eventos').find({ usuarioId: new ObjectId(usuarioId) }).toArray();
        } catch (error) {
            logError(error);
            throw new Error("Ocorreu um erro ao buscar eventos por usuário.");
        }
    }

    static async buscarPorPeriodo(inicio, fim) {
        try {
            const db = getDb();
            return await db.collection('eventos').find({
                dataInicio: { $gte: new Date(inicio) },
                dataFim: { $lte: new Date(fim) }
            }).toArray();
        } catch (error) {
            logError(error);
            throw new Error("Ocorreu um erro ao buscar eventos por período.");
        }
    }
    
    static async deletarPorId(id) {
        try {
            const db = getDb();
            const resultado = await db.collection('eventos').deleteOne({ _id: new ObjectId(id) });
            if (resultado.deletedCount === 0) {
                throw new Error("Evento não encontrado para deleção.");
            }
            return resultado;
        } catch (error) {
            logError(error);
            throw new Error(`Ocorreu um erro ao deletar o evento: ${error.message}`);
        }
    }
    
    static async atualizarPorId(id, novosDados) {
        try {
            const db = getDb();
            const resultado = await db.collection('eventos').updateOne({ _id: new ObjectId(id) }, { $set: novosDados });
            if (resultado.matchedCount === 0) {
                throw new Error("Evento não encontrado para atualização.");
            }
            return resultado;
        } catch (error) {
            logError(error);
            throw new Error(`Ocorreu um erro ao atualizar o evento: ${error.message}`);
        }
    }
}

module.exports = Evento;