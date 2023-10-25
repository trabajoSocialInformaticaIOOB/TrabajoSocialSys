const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');

/* verificar */

passport.use('local.signin', new LocalStrategy({
  usernameField: 'nombre',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, nombre, password, done) => {
  const rows = await pool.query('SELECT * FROM usuarios WHERE nombre = ?', [nombre]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, usuarios.password)
    if (validPassword) {
      done(null, user, req.flash('success', 'bienvenido a  ' + user.nombre));
    } else {
      done(null, false, req.flash('message', 'Incorrect Password'));
    }
  } else {
    return done(null, false, req.flash('message', 'The Username does not exists.'));
  }
}));

/* registrar */

passport.use('local.signup', new LocalStrategy({
  usernameField: 'nombre',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, nombre, password, done) => {
  let newUser = {
    nombre,
    password
  };
  newUser.password = await helpers.encryptPassword(password);
  

  const result = await pool.query('INSERT INTO usuarios SET ? ', [newUser]);
  newUser.id = result.insertId;
  return done(null, newUser);
}));
passport.serializeUser((user, done) => {
  done(null, user.id);
});


/*deserializar*/

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
  done(null, rows[0]);
});