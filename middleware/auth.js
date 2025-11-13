// middleware/auth.js

function requireLogin(req, res, next) {
  if (!req.session.userId) {
    // Se não há usuário na sessão, redireciona para o login
    res.redirect('/login');
  } else {
    // Se houver, permite que a requisição continue
    next();
  }
}

module.exports = { requireLogin };