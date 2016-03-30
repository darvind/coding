var  mongojs = require("mongojs");
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID; 

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var collection;


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(9001, function () {
  console.log('Example app listening on port 9001!');
});



MongoClient.connect('mongodb://hyperbook:hyperbook@localhost:27017/admin',

  function(err, db) {
    if(err) throw err;

    collection = db.collection('birds');
});


/*************************************/
app.post('/birds', function(req, res, next) {
  console.log(req.body);
  var bird = req.body;
  if(bird.name == null || bird.family == null || bird.continents ==null )  {
      console.log("Required parameter is missing");
      res.send("Required parameter is missing");
      return;
  }

  bird.added = new Date();

  if(bird.visible == null) 
     bird.visible = false;

  collection.insert( bird , function(e, results){
    if (e) return next(e)
    res.send(results)
  })
});


app.get('/birds', function(req, res, next) {
  collection.find({'visible':true} ,{limit:1000}).toArray(function(e, results){
    if (e) return next(e)
    res.send(results)
  })
})


app.get('/birds/:id', function(req, res, next) {
  console.log(req.params.id);
  collection.findOne({"_id":new ObjectId(req.params.id)}, function(e, result){
    if (e) return next(e)
    if(result) {
          res.send(result)
    }
    else {
         res.status(404).send('Not found');
    }
  })
})


app.delete('/birds/:id', function(req, res, next) {
  console.log(req.params.id);
  collection.remove({"_id":new ObjectId(req.params.id)}, function(e, result){
    if (e) return next(e)
    if(result) {
          res.send(result)
    }
    else {
         res.status(404).send('Not found');
    }
  })
})
