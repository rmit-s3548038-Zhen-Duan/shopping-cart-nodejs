var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Order = require('../models/order');
var Cart = require('../models/cart');

var csrfProtection = csrf();
router.use(csrfProtection);


//get profile page
router.get('/profile', isLoggedIn, function(req, res, next){
    Order.find({user: req.user}, function(err, orders){
        if(err){
            return res.write('Errors');
        }
        var cart;
        orders.forEach(function(order){
           cart = new Cart(order.cart);
           order.items = cart.generateArray();
        });
        res.render('user/profile', {orders: orders});

    });
});

//log out
router.get('/logout', function(req, res, next){
    req.logout();
    res.redirect('/');
});

//check if user is not logged in, then do the following.
router.use('/', notLoggedIn, function(req, res, next){
    next();
});

//sign up
router.get('/signup', function(req, res, next){
    //stored in error from passport
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), function(req, res, next){
    if(req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else{
        req.redirect('/user/profile');
    }
});

//sign in
router.get('/signin', function(req, res, next){
    //stored in error from passport
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function(req, res, next){
    if(req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else{
        req.redirect('/user/profile');
    }
});



module.exports = router;


//isLoggedIn middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/');
}

//notLoggedIn middleware
function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }

    res.redirect('/');
}