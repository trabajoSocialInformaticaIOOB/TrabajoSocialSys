const express = require('express');
const router  = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');

// SIGNUP
router.get('/',(req,res)=>{
    res.render('../views/');
});
router.get('/login', (req,res)=>{
    res.render('auth/login');
  });
  
  router.get('/signup', (req, res) => {
    res.send('puchi');
  });
  
  router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/authentication/login',
    failureFlash: true
  }));
  
  // entrar
 
  router.post('/signin', (req, res, next) => {
    req.check('nombre', 'usuario es requerido').notEmpty();
    req.check('password', 'Password is Required').notEmpty();
    const errors = req.validationErrors();
    if (errors.length > 0) {
      req.flash('message', errors[0].msg);
      res.redirect('/signin');
    }
    passport.authenticate('local.signin', {
      successRedirect: '/dashboard',
      failureRedirect: '/authentication/login',
      failureFlash: true
    })(req, res, next);
  });
  
  router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/authentication/login');
  });
  
  router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
  });
  
  module.exports = router;

