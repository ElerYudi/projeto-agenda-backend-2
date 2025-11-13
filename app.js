var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// --- NOSSAS ADIÇÕES (PROJETO 1 e PROJETO 2) ---
const { connectToDatabase } = require('./database/connection'); // Nosso P1
const session = require('express-session'); // Para Login (P2)
// --- FIM DAS NOSSAS ADIÇÕES ---

// --- ROTAS DO GERADOR (JÁ EXISTENTES) ---
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// --- NOSSA NOVA ROTA (P2) ---
var usuariosRouter = require('./routes/usuarios');
var categoriasRouter = require('./routes/categorias'); // <-- ADICIONE AQUI
var eventosRouter = require('./routes/eventos');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --- CONFIGURAÇÃO DA SESSÃO (P2) ---
app.use(session({
  secret: 'seu-segredo-mude-depois', // Chave secreta para assinar a sessão
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Em produção, use 'true' com HTTPS
}));

// --- CONEXÃO COM O BANCO (P1) ---
connectToDatabase().catch(err => {
  console.error("Falha ao conectar ao banco de dados", err);
  process.exit(1);
});

// --- CONFIGURAÇÃO DAS ROTAS (P2) ---
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/usuarios', usuariosRouter); // Rota para /usuarios/cadastrar
app.use('/categorias', categoriasRouter);
app.use('/eventos', eventosRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;