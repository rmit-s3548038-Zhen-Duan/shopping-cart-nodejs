var Product = require('../models/product');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shopping');

var products = [
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'Gothic Video Game',
        description: 'Awesome Game!!',
        price: 10
    }),

    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/9/91/WoW_Box_Art1.jpg',
        title: 'World of Warcraft Video Game',
        description: 'Awesome Game!!',
        price: 20
    }),

    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/4/41/Codbox.jpg',
        title: 'Call of Duty Video Game',
        description: 'Awesome Game!!',
        price: 40
    }),

    new Product({
        imagePath: 'https://images-na.ssl-images-amazon.com/images/I/81zJGr-TdWL._SY549_.jpg',
        title: 'Minecraft Video Game',
        description: 'Awesome Game!!',
        price: 25
    }),

    new Product({
        imagePath: 'https://guides.gamepressure.com/gfx/box/574.jpg',
        title: 'Dark Souls 3 Video Game',
        description: 'Awesome Game!!',
        price: 50
    }),
];

var done = 0;

for(var i = 0; i < products.length; i++){
    products[i].save(function(err, result){
        done ++;
        if(done === products.length){
            exit();
        }
    });
}

function exit(){
    mongoose.disconnect();
}








