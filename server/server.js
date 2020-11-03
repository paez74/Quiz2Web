var express = require('express')
var app = express()
var bodyParser = require('body-parser')
const MongoClient = require("mongodb").MongoClient;

async function main(){
  
const uri = "mongodb+srv://paez74:pumas74@webclass.1neja.mongodb.net/Quiz1retryWrites=true&w=majority";

const client = new MongoClient(uri);
 
  try {
      // Connect to the MongoDB cluster
     await client.connect();
     const database = client.db("Quiz1");
     const cards = database.collection("Games");
     const games = database.collection("Cards");
     var rancards = cards.aggregate([{$sample: {size: 5}}]);
     rancards.forEach(console.dir);
     await  listDatabases(client);

  } catch (e) {
      console.error(e);
  } finally {
    client.close()
  }
}

main().catch(console.error);

async function listDatabases(client){
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", null); // update to match the domain you will make the request from set to null because of origin
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


async function getCards() {
  try {
    // Connect to the MongoDB cluster
  const uri = "mongodb+srv://paez74:pumas74@webclass.1neja.mongodb.net/Quiz1retryWrites=true&w=majority";
   var client = new MongoClient(uri);
   await client.connect();
   const database = client.db("Quiz1");
   const cards = database.collection("Games");
   var rancards = cards.aggregate([ {$sample: {size: 5}}]);
   rancards.forEach(console.dir);
   return rancards;

  } catch (e) {
      console.error(e);
      return null;
  } finally {
   await  client.close()
  }
}

app.get('/cards', async function (req, res) {
  var ranCards =  null;
  ranCards = await getCards();
 

  res.send(ranCards)
})

app.get('/:gameId', function (req, res) {
  var gamesId = req.params.pokemonName;
  var game = games.findOne({ _id : gamesId}, function(err,result){
    if(err) {
      res.status(400).send({
        message: 'The pokemon doesn´t exist'
     });
    } else {
      res.status = 200;
      res.send(game);
    }
  });

  
})
var jsonParser = bodyParser.json();
app.post('/',jsonParser,function(req,res) {
  console.log(req.body);
  const currentGame = req.body;
  games.insert(currentGame,function(err,ans) {
    if(err) res.status(400).send({ message:"no se pudo crear juego"});
    else {
      res.status = 200; 
      res.send(ans);
    }
  })
})  

app.post('/:gameId',jsonParser,function(req,res) {
  console.log(req.body);
  const currentGame = req.body;
  var query = {_id: gameId}
  games.update(query,currentGame,function(err,ans) {
    if(err) res.status(400).send({message:"Couldnt update game"});
    else {
      res.status = 200; 
      res.send(ans);
    }
  })
})  

app.listen(3000);