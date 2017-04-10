var express = require('express');

var app = express();

var bodyParser = require('body-parser');

var fs = require("fs");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/Gems';


app.use(express.static('.'));

app.get('/', function(req,res){
  res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/gems/listGems', function(req,res) {
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log("Error in connecting to database.");
    }
    console.log("Connected to MongoDB database.");
    var cursor = db.collection('list').find();
    cursor.toArray(function(err, docs){
      res.end(JSON.stringify(docs));
      console.log("Fetched data!!");
    });
    db.close();
  });
})

app.get('/gems/:id', function(req,res){
  fs.readFile(__dirname + '/' + 'gems.json', 'utf8', function(err,data){
    gems = JSON.parse(data);
    var gem = gems["gem1"]
    console.log(gems);
    console.log(gems["gem1"]);
    res.end(JSON.stringify(gem));
  });
})

// This responds a POST request for the homepage
app.post('/gems/deleteGem', urlencodedParser, function (req, res) {
   var id = req.body.id;
   fs.readFile(__dirname + '/' + 'gems.json', 'utf8', function(err,data){
     data = JSON.parse(data);
     delete data["gem" + id];
     console.log(data);
     res.end(JSON.stringify(data));
   });
})

app.post('/gems/addGem', urlencodedParser, function (req, res) {
  gem = {
    name: "Azurite",
    description: "Some gems have hidden qualities beyond their luster, beyond their shine... Azurite is one of those gems.",
    shine: 8,
    price: 110.50,
    rarity: 7,
    color: "#CCC",
    faces: 14,
    images: [
      "img/gem-02.gif",
      "img/gem-05.gif",
      "img/gem-09.gif"
    ],
    reviews: [{
      stars: 5,
      body: "I love this gem!",
      author: "joe@thomas.com",
      createdOn: 1397490980837
    }, {
      stars: 1,
      body: "This gem sucks.",
      author: "tim@hater.com",
      createdOn: 1397490980837
    }]
  };
  console.log(user);
  fs.readFile(__dirname + '/' + 'gems.json', 'utf8', function(err,data){
    data = JSON.parse(data);
    data["gem4"] = gem;
    res.end(JSON.stringify(data));
  });
})

var server = app.listen(8000, function(){
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s",host,port)
})
