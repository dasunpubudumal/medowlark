var express = require('express');
var app = express();
var fs = require('fs');
var fortune = require('./lib/fortune.js');
var formidable = require('formidable');
var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});  //view engine will be handlebars.
//Layout will be in the 'main' handlebars file.
app.engine('handlebars', handlebars.engine);    //Setting up the view engine - handlebars.
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));  //The 'static' middleware allows us to designate one or more directories
//containing static resources to be directed into the routes. This is where your CSS and JS file would lie.
//Now that we have added the middleware, we can't type /public when addressing anymore as this directory 
//is invisible to the client.

app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    //This means if we're not running on a production server, showTest will set to true.
    next();
});

function getWeatherData() {
    return {
        locations: [
            {
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)',
            },
        ],
    };
}

//Lets assign getWeatherData() to res.locals so that the properties inside it is accessible to all
//the views.
//Do not put this below the routes because if you do, this use function will never run.
//because after executing render() method it won't run anything else.
app.use(function (req, res, next) {
    if (!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = getWeatherData(); //Here we have navigated to partials folder and assigned getWeatherData
    next();
    //We have widgets declared in partials folder.
});


app.get('/', function (req, res) {  //home page
    res.render('home', { title: 'Home' });
});

app.get('/about', function (req, res) { //about page
    res.render('about', { tite: 'About', fortune: fortune.getFortune(), pageTestScript: '/qa/tests-about.js' });
});

app.get('/contact', function (req, res) {  //contact page
    res.render('contact', { title: 'Contact' });
});

app.get('/tours/hood-river', function (req, res) {
    res.render('views/tours/hood-river', { title: 'Hood River' });
});
app.get('/tours/request-group-rate', function (req, res) {
    res.render('views/tours/request-group-rate', { title: 'RQR' });
});
app.get('/jquery', function (req, res) {
    res.render('jquery-test'), { title: 'jQuery Test' };
});
app.get('/nursery-rhyme', function (req, res) {
    res.render('nursery-rhyme', { title: 'Nursery Rhyme' });
});
app.get('/data/nursery-rhyme', function (req, res) {
    res.json({
        animal: 'basilisk'
    });
});

app.use(require('body-parser')());

app.get('/newsletter', function (req, res) {
    // we will learn about CSRF later...for now, we just
    // provide a dummy value
    res.render('newsletter', { csrf: 'CSRF token goes here' });
});

//POST requests process the data.
app.post('/process', function (req, res) {  
    //process is here to process the data given in the form.
    console.log('Form (from querystring): ' + req.query.form);  
    //req.query returns data from the querystring.
    console.log('CSRF token (from hidden form field): ' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.name);
    console.log('Email (from visible form field): ' + req.body.email);
    res.redirect(303, '/thank-you'); //after processing the form data, it-
    //-redirects to /thank-you
});

app.get('/thank-you', function(req, res){
    res.render('thank-you');
});

app.get('/contest/vacation-photo', function(req,res){
    var now = new Date();
    res.render('contest/vacation-photo', {year: now.getFullYear(), month: now.getMonth()});
});

app.post('/contest/vacation-photo/:year/:month', function(req,res){ //:year and :month are specified as 'route parameters'
    var form = formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        if(err) return res.redirect(303,'/404');    //Redirect to an error page. Not necessarily an 404.
        console.log('recieved fields.');
        console.log(fields);
        console.log('recieved files');
        console.log(files);
        //Now you can store these in a database or do anything here. 
        res.redirect(303,'/thank-you'); //Finally redirect to thank-you page.
    });

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