var express = require('express');
var app = express();
var fs = require('fs');
var handlebars = require('express3-handlebars').create({ defaultLayout: 'main' });  //view engine will be handlebars.
//Layout will be in the 'main' handlebars file.
app.engine('handlebars', handlebars.engine);    //Setting up the view engine - handlebars.
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));  //The 'static' middleware allows us to designate one or more directories
//containing static resources to be directed into the routes. This is where your CSS and JS file would lie.
//Now that we have added the middleware, we can't type /public when addressing anymore as this directory 
//is invisible to the client.

var fortunes = [
    "Conquer your fears or they will conquer you.",
    "Rivers need springs.",
    "Do not fear what you don't know.",
    "You will have a pleasant surprise.",
    "Whenever possible, keep it simple."
];

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/about', function (req, res) {
    var randomFortune = 
        fortunes[Math.floor((Math.random() * fortunes.length))];
    var myName = "Dasun";
    res.render('about', {fortune: randomFortune, name: myName});
});

// custom 404 page
app.use(function (req, res) {
    res.status(404);
    res.render('404');
});
// custom 500 page
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});