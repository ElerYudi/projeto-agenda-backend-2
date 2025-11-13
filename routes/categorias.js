const express = require('express');
const router = express.Router();
const Categoria = require('../models/Categoria');
const { requireLogin } = require('../middleware/auth.js');

router.use(requireLogin);

router.get('/', async (req, res, next) => {
  try {
    const categorias = await Categoria.buscarPorUsuario(req.session.userId);
    res.render('categorias/index', { categorias: categorias });
  } catch (error) {
    next(error);
  }
});

router.get('/nova', (req, res, next) => {
  res.render('categorias/form', { titulo: 'Nova Categoria' });
});

router.post('/nova', async (req, res, next) => {
  const { nome, descricao } = req.body;
  try {
    const novaCategoria = new Categoria(nome, req.session.userId, descricao);
    await novaCategoria.salvar();
    res.redirect('/categorias');
  } catch (error) {
    res.render('categorias/form', { 
      titulo: 'Nova Categoria', 
      erro: error.message 
    });
  }
});

router.get('/editar/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const categoria = await Categoria.buscarPorId(id);

    if (!categoria || !categoria.usuarioId.equals(req.session.userId)) {
      return res.status(403).send('Acesso negado');
    }

    res.render('categorias/editar', { categoria: categoria });
  } catch (error) {
    next(error);
  }
});


router.post('/editar/:id', async (req, res, next) => {
  const id = req.params.id;
  const { nome, descricao } = req.body;
  const novosDados = { nome, descricao };

  try {
    const categoriaExistente = await Categoria.buscarPorId(id);
    if (!categoriaExistente || !categoriaExistente.usuarioId.equals(req.session.userId)) {
      return res.status(403).send('Acesso negado');
    }

    await Categoria.atualizarPorId(id, novosDados);
    res.redirect('/categorias');
  } catch (error) {
    const categoria = { _id: id, ...novosDados };
    res.render('categorias/editar', {
      erro: error.message,
      categoria: categoria
    });
  }
});


router.get('/deletar/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const categoriaExistente = await Categoria.buscarPorId(id);

    if (!categoriaExistente || !categoriaExistente.usuarioId.equals(req.session.userId)) {
      return res.status(403).send('Acesso negado');
    }

    await Categoria.deletarPorId(id);
    res.redirect('/categorias');
  } catch (error) {
    next(error);
  }
});

module.exports = router;