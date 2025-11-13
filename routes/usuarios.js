// routes/usuarios.js
const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario'); // Importando nosso Model do P1

/* Rota GET para MOSTRAR a página de cadastro. */
router.get('/cadastrar', function(req, res, next) {
  // Apenas renderiza a View 'cadastro.ejs'
  // Você ainda precisa criar o arquivo 'views/cadastro.ejs'
  res.render('cadastro', { title: 'Cadastro' }); 
});

/* Rota POST para PROCESSAR os dados do cadastro */
router.post('/cadastrar', async function(req, res, next) {
  // 1. Recebemos os parâmetros POST
  const { nome, email, senha } = req.body;

  try {
    // 2. Usamos o Model do Projeto 1
    const novoUsuario = new Usuario(nome, email, senha);
    await novoUsuario.salvar();

    // 3. Se deu certo, redireciona para a home (ou login)
    res.redirect('/'); 

  } catch (error) {
    // 4. Se deu erro (ex: e-mail duplicado, campo obrigatório)
    // Renderiza a página de cadastro DE NOVO, mas agora passando a mensagem de erro
    res.render('cadastro', { erro: error.message });
  }
});

module.exports = router;