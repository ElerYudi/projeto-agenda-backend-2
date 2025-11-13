var express = require('express');
var router = express.Router();
const Usuario = require('../models/Usuario');

router.get('/', function(req, res, next) {
  if (req.session.userId) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login', async function(req, res, next) {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.buscarPorEmail(email);

    if (!usuario || usuario.senha !== senha) {
      res.render('login', { erro: 'Email ou senha inválidos' }); 
      return;
    }

    req.session.userId = usuario._id;
    req.session.userName = usuario.nome;
    
    res.redirect('/dashboard');

  } catch (error) {
    res.render('login', { erro: error.message });
  }
});

const { requireLogin } = require('../middleware/auth.js');

router.get('/dashboard', requireLogin, function(req, res, next) {
  res.render('dashboard', { 
    title: 'Dashboard',
    userName: req.session.userName
  });
});

router.get('/logout', (req, res, next) => {

  req.session.destroy(err => {
    if (err) {
      return next(err);
    }
    
    res.redirect('/login');
  });
});

module.exports = router;