var express = require('express'),
    helmet = require('helmet'),
    routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(helmet.csp());
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

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
