var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 8000));
app.use("/styles",express.static(__dirname + "/public"));
app.use("/script",express.static(__dirname + "/public"));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/login', function(request, response) {
	response.render('pages/login');
});

app.get('/dashboard',function(request,response) {
	response.render('pages/dashboard');
})
app.get('/signup', function(request, response) {
	response.render('pages/signup');
});
app.get('/forget_pass', function(request, response) {
	response.render('pages/forget_pass');
});
app.get('/error', function(request, response) {
	response.render('pages/error');
});
app.get('/', function(request, response) {
	response.render('pages/guest');
});

app.get('/event/:id', function (request, response) {
	response.render('pages/index');
});

app.get('/event/new', function (request, response) {
	response.render('pages/index');
});

app.get('/dashboard/search', function(request, response) {
	response.render('pages/dashboard');
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});

app.get('/edit_profile', function(request, response) {
	response.render('pages/edit_profile');
});

app.get('/about_us', function(request, response) {
	response.render('pages/about_us');
});
