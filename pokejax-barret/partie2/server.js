var http = require("http"),
    url = require("url"),
    pokedex = require("pokedex"),
    querystring = require('querystring'),
    WebSocketServer = require('ws').Server,
    Chance = require('chance');



var express = require('express');

var app = express();

var poketri = pokedex.map(function(pokemon){
return {
   numero: pokemon.numéro,
   nom: pokemon.nom,
   nomen: pokemon.nomen,
   nomja: pokemon.nomja,
   espece : pokemon.espece,
   type1 : pokemon.type1,
   url : "http://www.pokebip.com/pokemon/pokedex/images/sugimori/" + parseInt(pokemon.numéro, 10) +".png/"
}
});

poketri.sort();

var selectPokemons = function selectPokemons (request, response, nom) {
  console.log("Entrée dans le callback : selectPokemons() - Requete: "+nom);  
  //récupérer les pokémons associés au nom
  var aRenvoyer = poketri.filter(function(row) {
    if (row.nom.toLowerCase().indexOf(nom.toLowerCase())>=0) return true;
  });
  response.writeHead(200, {'Content-Type': 'application/json'});
  response.end(JSON.stringify(aRenvoyer));
  
  return;  
};

var getPokemon = function selectPokemons (request, response, nom) {
  console.log("Entrée dans le callback : getPokemon() - Requete: "+nom);  
  //récupérer le pokémons associé au nom
  var aRenvoyer = pokedex.filter(function(row) {
    if (row.nom.toLowerCase().indexOf(nom.toLowerCase())>=0) return true;
  });
  
  response.writeHead(200, {'Content-Type': 'application/json'});
  response.end(JSON.stringify(aRenvoyer));
  
  return;  
};


var getAllPokemons = function getAllPokemons (request, response) {
    console.log("Entrée dans le callback : getAllPokemons()");
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(poketri));
    return;          
};


app.use(express.static(__dirname + '/client'));


app.get('/pokemons/', function(req, res) {
 getAllPokemons(req,res);
});

app.get('/search/:nom/', function(req, res) {
  selectPokemons(req,res,req.params.nom);
});

app.get('/pokemon/:nom/', function(req, res) {
  getPokemon(req,res,req.params.nom);
});

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
});

var server = app.listen(8080);


wss = new WebSocketServer({server: server, path: "/"});

var chatroom = [151];
var size = 151;
while(size--) chatroom[size] = [];

var roomNumber, message = null;

//Création d'un objet chance pour attribuer un nom d'utilisateur
var chance = new Chance();

wss.on('connection', function (ws) { 

  // Envoi d'un message demandant l'initialisation au client
  ws.send(JSON.stringify({
            type: 'init',
            username : chance.name()
          }));
  console.log("< Envoi d'un message de type init");
  ws.on('message', function (message) {    
    var message = JSON.parse(message);
    console.log("> Message reçu de type : "+ message.type);
    var type = message.type;
    switch(type){
      case 'init':
        roomNumber = message.numero-1;
        try {chatroom[roomNumber].push(ws);}catch(err){}
        chatroom[roomNumber].forEach(function(socket,index) {
          try {
            socket.send(JSON.stringify({
            type: 'newUser',
            nbusers : chatroom[roomNumber].length
            }));
            console.log("< Envoi d'un message de type newUser ("+chatroom[roomNumber].length+")");
          }catch(err){
             chatroom[roomNumber].splice(index,1);
          }
          
        }); 

        break;

      case 'message':
        roomNumber = message.numero-1;
        chatroom[roomNumber].forEach(function(socket,index) {
          try{
              socket.send(JSON.stringify(message));
              console.log("< Envoi d'un message de type message");
          }catch(err){
              chatroom[roomNumber].splice(index,1);

              // On met à jour le nombre d'utilisateurs
              chatroom[roomNumber].forEach(function(socket,index) {
                try {
                  socket.send(JSON.stringify({
                  type: 'newUser',
                  nbusers : chatroom[roomNumber].length
                  }));
                  console.log("< Envoi d'un message de type newUser ("+chatroom[roomNumber].length+")");
                }catch(err){
                   chatroom[roomNumber].splice(index,1);
                }
                
              }); 

          }
          
        }); 
        break;
    }
  }); 

  
});