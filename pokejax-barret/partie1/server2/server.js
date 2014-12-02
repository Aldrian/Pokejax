var express = require('express');

var app = express();


app.use('/', express.static(__dirname));

//Lancement du serveur
app.set('port', process.env.PORT || 9000);
var server = app.listen(app.get('port'), function() {
  console.log('Serveur 2 OK');
});