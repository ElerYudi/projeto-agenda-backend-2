const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

router.get('/cadastrar', function(req, res, next) {
  res.render('cadastro', { title: 'Cadastro' }); 
});

router.post('/cadastrar', async function(req, res, next) {
  const { nome, email, senha } = req.body;

  try {
    const novoUsuario = new Usuario(nome, email, senha);
    await novoUsuario.salvar();

    res.redirect('/'); 

  } catch (error) {
    res.render('cadastro', { erro: error.message });
  }
});

module.exports = router;