const express = require('express');
const router = express.Router();
const Evento = require('../models/Evento');
const Categoria = require('../models/Categoria');
const { requireLogin } = require('../middleware/auth.js');
const { ObjectId } = require('mongodb');

function formatarDataParaInput(data) {
  if (!data) return '';
  const dataObj = new Date(data);
  dataObj.setMinutes(dataObj.getMinutes() - dataObj.getTimezoneOffset());
  return dataObj.toISOString().slice(0, 16);
}

router.use(requireLogin);

router.get('/', async (req, res, next) => {
  try {
    const { categoria } = req.query;
    const eventos = await Evento.buscarPorUsuarioFiltro(req.session.userId, categoria);
    const categorias = await Categoria.buscarPorUsuario(req.session.userId); 

    res.render('eventos/index', {
      eventos: eventos,
      categorias: categorias,
      categoriaSelecionada: categoria || 'todos'
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const eventos = await Evento.buscarPorUsuario(req.session.userId);
    res.render('eventos/index', { eventos: eventos });
  } catch (error) {
    next(error);
  }
});

router.get('/novo', async (req, res, next) => {
  try {
    const categorias = await Categoria.buscarPorUsuario(req.session.userId);
    res.render('eventos/form', { 
      titulo: 'Novo Evento', 
      categorias: categorias 
    });
  } catch (error) {
    next(error);
  }
});

router.get('/editar/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const evento = await Evento.buscarPorId(id);
    const categorias = await Categoria.buscarPorUsuario(req.session.userId);

    if (!evento) {
      return res.status(404).send('Evento não encontrado');
    }

    if (!evento.usuarioId.equals(req.session.userId)) {
      return res.status(403).send('Acesso negado');
    }

    const dataFormatada = {
      inicio: formatarDataParaInput(evento.dataInicio),
      fim: formatarDataParaInput(evento.dataFim)
    };

    res.render('eventos/editar', {
      evento: evento,
      categorias: categorias,
      dataFormatada: dataFormatada
    });
  } catch (error) {
    next(error);
  }
});

router.get('/deletar/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const evento = await Evento.buscarPorId(id);

    if (!evento.usuarioId.equals(req.session.userId)) {
      return res.status(403).send('Acesso negado');
    }

    await Evento.deletarPorId(id);
    res.redirect('/eventos');
  } catch (error) {
    next(error);
  }
});

router.post('/editar/:id', async (req, res, next) => {
  const id = req.params.id;
  const { titulo, dataInicio, dataFim, categoriaId, local, descricao } = req.body;
  const novosDados = {
    titulo,
    dataInicio: new Date(dataInicio),
    dataFim: new Date(dataFim),
    categoriaId: new ObjectId(categoriaId),
    local,
    descricao
  };

  try {
    const evento = await Evento.buscarPorId(id);

    if (!evento.usuarioId.equals(req.session.userId)) {
      return res.status(403).send('Acesso negado');
    }

    await Evento.atualizarPorId(id, novosDados);
    res.redirect('/eventos');
  } catch (error) {
    const categorias = await Categoria.buscarTodos();
    res.render('eventos/editar', {
      erro: error.message,
      evento: { _id: id, ...novosDados },
      categorias: categorias,
      dataFormatada: {
        inicio: dataInicio,
        fim: dataFim
      }
    });
  }
});

router.post('/novo', async (req, res, next) => {
  const { titulo, dataInicio, dataFim, categoriaId, local, descricao } = req.body;
  try {
    const novoEvento = new Evento(
      titulo,
      new Date(dataInicio),
      new Date(dataFim),
      req.session.userId,
      categoriaId,
      descricao,
      local
    );
    await novoEvento.salvar();
    res.redirect('/eventos');
  } catch (error) {
    const categorias = await Categoria.buscarTodos();
    res.render('eventos/form', {
      titulo: 'Novo Evento',
      erro: error.message,
      categorias: categorias
    });
  }
});

module.exports = router;