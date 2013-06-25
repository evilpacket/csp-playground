var express = require('express'),
    http = require('http'),
    helmet = require('helmet'),
    fs = require('fs'),
    routes = require('./routes');

var data = {
    template: "",
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

helmet.csp.reportTo('/report');

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

app.get('/test', helmet.csp(), function (req, res) {
    if (data.template) {
        res.send(data.template);
    } else {
        res.redirect('/template/edit');
    }
});


app.get('/template/edit', function (req, res) {
    res.render('edit_template', data);
});

app.post('/template/edit', function (req, res) {
    data.template = req.body.html;
    res.render('edit_template', data);
});

app.post('/csp', function (req, res) {
    console.log(req.body);
    console.log(req.headers);
    res.send('');
});

app.post('/report', function (req, res) {
    console.log(JSON.stringify(req.body,null, 4) + "\n");
    res.send("");
});


console.log('Server running on port 3000');
var server = http.createServer(app).listen(3000);
