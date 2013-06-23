var express = require('express'),
    http = require('http'),
    helmet = require('helmet'),
    fs = require('fs'),
    routes = require('./routes');

var data = {
    violation_template: "",
    example_template: fs.readFileSync('example_template')
};

var app = express();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// Routes
app.get('/', routes.index);
app.get('/policy', routes.getPolicy);
app.post('/policy', function (req, res) {
    if (req.body.policy) {
        try {
            var policy = JSON.parse(req.body.policy);
            helmet.csp.policy(policy);
            res.redirect('/policy');
        } catch (e) {
            console.log(e);
            res.redirect('/policy');
        }
    } else {
        res.redirect('/policy');
    }
});

app.get('/violation', helmet.csp(), function (req, res) {
    if (data.violation_template) {
        res.send(data.violation_template);
    } else {
        res.redirect('/violation/edit');
    }
});


app.get('/violation/edit', function (req, res) {
    res.render('edit_violation', data);
});

app.post('/violation/edit', function (req, res) {
    data.violation_template = req.body.html;
    res.render('edit_violation', data);
});

app.post('/csp', function (req, res) {
    console.log(req.body);
    console.log(req.headers);
    res.send('');
});


console.log('Server running on port 3000');
var server = http.createServer(app).listen(3000);
