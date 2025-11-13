// routes/index.js
var express = require('express');
var router = express.Router();
const Usuario = require('../models/Usuario'); // Importamos o Model!

/* GET da página principal (home) */
router.get('/', function(req, res, next) {
  // Se já estiver logado, vai pro dashboard. Senão, vai pro login.
  if (req.session.userId) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

/* GET da página de login */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

/* POST para processar o login */
router.post('/login', async function(req, res, next) {
  const { email, senha } = req.body;

  try {
    // 1. Buscar o usuário pelo e-mail
    const usuario = await Usuario.buscarPorEmail(email);

    // 2. Verificar se o usuário existe E se a senha está correta
    // (No P1, salvamos a senha em texto puro, então comparamos direto)
    if (!usuario || usuario.senha !== senha) {
      // Se errar, renderiza o login de novo com a mensagem de erro [cite: 51]
      res.render('login', { erro: 'Email ou senha inválidos' }); 
      return;
    }

    // 3. Salvar o usuário na SESSÃO
    // Este é o passo mais importante da autenticação!
    req.session.userId = usuario._id;
    req.session.userName = usuario.nome;
    
    // 4. Redirecionar para o painel principal
    res.redirect('/dashboard');

  } catch (error) {
    // Se der um erro no banco, mostra o erro
    res.render('login', { erro: error.message });
  }
});

const { requireLogin } = require('../middleware/auth.js');

/* GET Dashboard - ROTA PROTEGIDA */
// Note o 'requireLogin' no meio. Ele é o porteiro.
router.get('/dashboard', requireLogin, function(req, res, next) {
  res.render('dashboard', { 
    title: 'Dashboard',
    userName: req.session.userName // Pega o nome da sessão
  });
});

/* GET Logout */
router.get('/logout', (req, res, next) => {
  // Destrói a sessão
  req.session.destroy(err => {
    if (err) {
      return next(err);
    }
    // Redireciona para o login
    res.redirect('/login');
  });
});

module.exports = router;