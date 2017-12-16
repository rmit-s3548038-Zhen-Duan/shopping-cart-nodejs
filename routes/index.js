var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

var Product = require('../models/product');
var Order = require('../models/order');


/* GET home page. */
router.get('/', function(req, res, next) {
    var successMsg = req.flash('success')[0];
    var products = Product.find(function (err, docs) {
      res.render('shop/index', { title: 'Shopping Cart', products: docs, successMsg: successMsg, noMessage: !successMsg });

  });
});

//Add to cart
router.get('/add-to-cart/:id', function(req, res, next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

    Product.findById(productId, function(err, product){
        if(err){
            return res.redirect('/');
        }

        cart.add(product, product.id);
        //store the cart in the session
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
    });
});

//reduce one
router.get('/reduce/:id', function(req, res, next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

//Add one unit
router.get('/addOne/:id', function(req, res, next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

    cart.addOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});


//remove item
router.get('/remove/:id', function(req, res, next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

//Shopping-cart
router.get('/shopping-cart', function(req, res, next){
    if(!req.session.cart){
        return res.render('shop/shopping-cart', {products: null});
    }

    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

//Checkout
router.get('/checkout',isLoggedIn, function(req, res, next){
    if(!req.session.cart){
        return res.render('shop/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function(req, res, next){

    if(!req.session.cart){
        return res.render('shop/shopping-cart');
    }
    var cart = new Cart(req.session.cart);

    var stripe = require("stripe")(
        "sk_test_jnX8oyULRpef1AjbUIBI7Erc"
    );

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "aud",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
        // asynchronously called
        if(err){
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }

        var order = new Order({
           user: req.user,
           cart: cart,
           address: req.body.address,
           name: req.body.name,
           paymentId: charge.id
        });

        order.save(function(err, result){
            req.flash('success', 'Successfully bought product');
            req.session.cart = null;
            res.redirect('/');
        });


    });
});


module.exports = router;


//isLoggedIn middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldUrl = req.url; //?????
    res.redirect('/user/signin');
}