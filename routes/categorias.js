// routes/categorias.js
const express = require('express');
const router = express.Router();
const Categoria = require('../models/Categoria');
const { requireLogin } = require('../middleware/auth.js');

// Proteger TODAS as rotas de categoria com o login
router.use(requireLogin);

/* GET - Listar todas as categorias */
router.get('/', async (req, res, next) => {
  try {
    const categorias = await Categoria.buscarTodos();
    res.render('categorias/index', { categorias: categorias });
  } catch (error) {
    next(error);
  }
});

/* GET - Formulário para nova categoria */
router.get('/nova', (req, res, next) => {
  res.render('categorias/form', { titulo: 'Nova Categoria' });
});

/* POST - Salvar nova categoria */
router.post('/nova', async (req, res, next) => {
  // 1. Removido "cor" daqui
  const { nome, descricao } = req.body;
  try {
    // 2. Removido "cor" daqui
    const novaCategoria = new Categoria(nome, descricao);
    await novaCategoria.salvar();
    res.redirect('/categorias');
  } catch (error) {
    res.render('categorias/form', { 
      titulo: 'Nova Categoria', 
      erro: error.message 
    });
  }
});

/* GET - Formulário para EDITAR categoria */
router.get('/editar/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const categoria = await Categoria.buscarPorId(id);

    if (!categoria) {
      return res.status(404).send('Categoria não encontrada');
    }

    res.render('categorias/editar', { categoria: categoria });
  } catch (error) {
    next(error);
  }
});

/* POST - Processar a ATUALIZAÇÃO da categoria */
router.post('/editar/:id', async (req, res, next) => {
  const id = req.params.id;
  // 3. Removido "cor" daqui
  const { nome, descricao } = req.body;
  const novosDados = { nome, descricao }; // E daqui

  try {
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

/* GET - Deletar categoria */
router.get('/deletar/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    await Categoria.deletarPorId(id);
    res.redirect('/categorias');
  } catch (error) {
    next(error);
  }
});

module.exports = router;