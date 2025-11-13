// routes/eventos.js
const express = require('express');
const router = express.Router();
const Evento = require('../models/Evento');
const Categoria = require('../models/Categoria'); // Precisamos para o <select>
const { requireLogin } = require('../middleware/auth.js');
const { ObjectId } = require('mongodb');

function formatarDataParaInput(data) {
  if (!data) return '';
  const dataObj = new Date(data);
  // Subtrai o fuso horário para a data local ficar correta
  dataObj.setMinutes(dataObj.getMinutes() - dataObj.getTimezoneOffset());
  // Formata para YYYY-MM-DDTHH:MM
  return dataObj.toISOString().slice(0, 16);
}

// Proteger TODAS as rotas de evento
router.use(requireLogin);

/* GET - Listar eventos do usuário logado */
router.get('/', async (req, res, next) => {
  try {
    // Pega eventos APENAS do usuário da sessão
    const eventos = await Evento.buscarPorUsuario(req.session.userId);
    res.render('eventos/index', { eventos: eventos });
  } catch (error) {
    next(error);
  }
});

/* GET - Formulário para novo evento */
router.get('/novo', async (req, res, next) => {
  try {
    // Pega as categorias para o <select> do formulário
    const categorias = await Categoria.buscarTodos();
    res.render('eventos/form', { 
      titulo: 'Novo Evento', 
      categorias: categorias 
    });
  } catch (error) {
    next(error);
  }
});

/* GET - Formulário para EDITAR evento */
router.get('/editar/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    // Precisamos buscar o evento E as categorias
    const evento = await Evento.buscarPorId(id);
    const categorias = await Categoria.buscarTodos();

    if (!evento) {
      return res.status(404).send('Evento não encontrado');
    }

    // Apenas eventos do próprio usuário podem ser editados
    if (!evento.usuarioId.equals(req.session.userId)) {
      return res.status(403).send('Acesso negado');
    }

    // Formata as datas para o formulário
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

/* GET - Deletar evento */
router.get('/deletar/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    
    // Validar se o evento pertence ao usuário (segurança)
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

/* POST - Processar a ATUALIZAÇÃO do evento */
router.post('/editar/:id', async (req, res, next) => {
  const id = req.params.id;
  const { titulo, dataInicio, dataFim, categoriaId, local, descricao } = req.body;
  const novosDados = {
    titulo,
    dataInicio: new Date(dataInicio),
    dataFim: new Date(dataFim),
    categoriaId: new ObjectId(categoriaId), // Precisamos do ObjectId
    local,
    descricao
  };

  try {
    // Validar se o evento pertence ao usuário (segurança)
    const evento = await Evento.buscarPorId(id);
    if (!evento.usuarioId.equals(req.session.userId)) {
      return res.status(403).send('Acesso negado');
    }

    await Evento.atualizarPorId(id, novosDados);
    res.redirect('/eventos');
  } catch (error) {
    // Se der erro, renderiza o form de novo
    const categorias = await Categoria.buscarTodos();
    res.render('eventos/editar', {
      erro: error.message,
      evento: { _id: id, ...novosDados }, // Remonta o objeto
      categorias: categorias,
      dataFormatada: {
        inicio: dataInicio,
        fim: dataFim
      }
    });
  }
});

/* POST - Salvar novo evento */
router.post('/novo', async (req, res, next) => {
  const { titulo, dataInicio, dataFim, categoriaId, local, descricao } = req.body;
  try {
    const novoEvento = new Evento(
      titulo,
      new Date(dataInicio),
      new Date(dataFim),
      req.session.userId, // <-- O ID do usuário logado!
      categoriaId,
      descricao,
      local
    );
    await novoEvento.salvar();
    res.redirect('/eventos');
  } catch (error) {
    // Se der erro, 
    // renderiza o formulário de novo com a mensagem e os dados
    const categorias = await Categoria.buscarTodos();
    res.render('eventos/form', {
      titulo: 'Novo Evento',
      erro: error.message,
      categorias: categorias
    });
  }
});

module.exports = router;