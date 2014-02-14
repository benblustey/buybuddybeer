
/**
 * Module dependencies.
 */

var express = require('express')
    ,routes = require('./routes')
    ,user = require('./routes/user')
    ,http = require('http')
    ,path = require('path')
    ,mongoose = require('mongoose');


var app = express();
// all environments

app.configure( function (){
  app.set('port', process.env.PORT || 3000);
  app.set('vies', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico')));
  // app.use(express.bodyParser());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/buyBuddyBeer')

var buddyBeerSchema = new mongoose.Schema({
       from: String,
      buddy: String,
    amount: Number,
       note: String,
       date: { type: Date, default: Date.now },
}), BuddyBeer = mongoose.model('BuddyBeer', buddyBeerSchema);

app.get('/', function (req,res) {
  BuddyBeer.find({}, function (err, buddyBeers) {
    res.render('index', { buddyBeers: buddyBeers });
  })
});

app.get('/admin', function (req,res) {
  BuddyBeer.find({}, function (err, buddyBeers) {
    res.render('admin', { buddyBeers: buddyBeers });
  })
});

app.get('/admin/create', function (req,res) {
  BuddyBeer.find({}, function (err, buddyBeers) {
    res.render('create', { buddyBeers: buddyBeers });
  })
});

// CREATE ATOM
app.post('/admin/create', function (req, res) {
  var b = req.body;
  new BuddyBeer({
       from: b.from,
      buddy: b.buddy,
     amount: b.amount,
       note: b.note,
       date: { type: Date, default: Date.now },
  }).save(function (err, docs) {
    if (err) res.json(err);
    res.redirect('/admin/');
  });
});

// PARAMS
app.param('buddyId', function (req, res, next, buddyId) {
  BuddyBeer.find({ _id: buddyId }, function (err, docs) {
    req.buddyBeer = docs[0];
    next();
  });
});

app.get('/admin/:buddyId/edit', function (req, res) {
  res.render('edit', { buddyBeer: req.buddyBeer });
})

// UPDATE
app.put('/admin/:buddyId', function (req, res) {
  var b = req.body;
  BuddyBeer.update(
    { _id: req.params.buddyId},
    { from: b.from, buddy: b.buddy, note: b.note, amount: b.amount },
    function (err) {
      res.redirect('/admin/#' + b.buddyId);
    }
  )
})
app.post('/admin/update', function (req, res) {
  var b = req.body;
  BuddyBeer.update(
    { _id: b._id},
    { from: b.from, buddy: b.buddy, note: b.note, amount: b.amount },
    function (err) {
      res.redirect('/admin');
    }
  )
})



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
