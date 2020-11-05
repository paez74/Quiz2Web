var express = require('express')
var app = express()
var bodyParser = require('body-parser')
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

var jsonParser = bodyParser.json();
const uri = "mongodb+srv://paez74:pumas74@webclass.1neja.mongodb.net/Quiz1retryWrites=true&w=majority";
const client = new MongoClient(uri);
 client.connect();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", null); // update to match the domain you will make the request from set to null because of origin
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});




app.get('/cards', async function (req, res) {
  var ranCards =  null;
  ranCards = await getCards();
  ranCards.forEach(console.dir);
  res.send(ranCards)
})

app.get('/game/:gameId',async function (req, res) {
  var gameId = req.params.gameId;
  var o_id = new ObjectId(gameId);
  console.log(gameId);
  try {
    const database = client.db("Quiz1");
    const games = database.collection("Cards");
    var game =  games.findOne({ _id : o_id},function(error, response) {
      if(error) {
        console.log("Creo un error");
        res.send(null);
      } else {
        console.log("got Game",response);
        res.send(response);
      }
    });
    return game;
 
   } catch (e) {
       console.error(e);
       res.send(null);
   } 

  res.send(game);
})

app.post('/',jsonParser,async function(req,res) {
  console.log(req.body.cards);
  const cards = req.body.cards;
  try {
    const database = client.db("Quiz1");
    const games = database.collection("Cards");
    var game = {'cards':cards}
    var result = await  games.insertOne(game, function (error, response) {
     if(error) {
         console.log('Error occurred while inserting');
         res.send(null)
     } else {
        console.log('inserted record', response.ops[0]);
        res.send( response.ops[0]);  
     }
 });
     return result;
   } catch (e) {
       console.error(e);
       res.send(null);
   } 
 
})  

app.post('/game',jsonParser,async function(req,res) {
  const gameId = req.body.id;
  var o_id = new ObjectId(gameId);
  console.log(o_id);
  const cards = req.body.cards;
  console.log(cards);
  var query = {_id: o_id}

  try {
    const database = client.db("Quiz1");
    const games = database.collection("Cards");
    var game = {$set:{'cards':cards} }
    var result = await  games.updateOne(query,game, function (error, response) {
     if(error) {
         console.log('Error occurred while inserting');
         res.send(null)
     } else {
        console.log("Update correcto");
        res.send( true);  
     }
 });
     return result;
   } catch (e) {
       console.error(e);
       res.send(null);
   } 
  

})  

app.listen(3000);


// Functions 

async function getCards() {
  try {
   const database = client.db("Quiz1");
   const cards = database.collection("Games");
   var rancards = cards.aggregate([ {$sample: {size: 5}}]).toArray();;
   return rancards;

  } catch (e) {
      console.error(e);
      return null;
  } 
}


