var app = angular.module('Pokejax', ['ngRoute','ngAnimate'])

.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : '../html/home.html',
                controller  : 'searchController'
            })
            .when('/rapport/', {
                templateUrl : '../html/rapport.html',
                controller  : 'rapportController'
            })
            .when('/pokemon/:nomPokemon', {
                templateUrl : '../html/displayPokemon.html',
                controller  : 'pokemonController'
            });

    });





app.controller('searchController', ['$scope', '$http', '$location', function($scope,$http,$location) {
$scope.loaded = false;
getAllPokemons = function() {
$scope.loaded=false;	
	$http.get('/pokemons/').
	  success(function(data, status, headers, config) {	  	
	    readData(data);
	    $scope.loaded=true;	
	        
	  }).
	  error(function(data, status, headers, config) {
	  	console.log("Il y a eu une erreur");
	  	$scope.loaded=true;	

	  });
};

$scope.search = function() {
$scope.loaded=false;	
	if ($scope.keywords == undefined) {
		getAllPokemons();

	}
	else {
		$http.get('/pokemon/'+ $scope.keywords + '/').
		  success(function(data, status, headers, config) {	
		  	readData(data);
		  	$scope.loaded=true;		  	   
		  }).
		  error(function(data, status, headers, config) {
		  	this.displayError();
		  	$scope.loaded=true;	   
		  });
	};		

};

readData = function(data) {	
		if (data.length == 0) {
			$scope.errorMessage = "Aucun pokémon correspondant à ce nom n'a été trouvé";
		} else {
			$scope.errorMessage = undefined;
		}
		;
		$scope.pokemons = data;
		
};


$scope.getFiche = function(nom) {
	$location.path('/pokemon/'+nom);	
};



this.displayError = function() {			
	$scope.errorMessage = "Erreur lors de la récupération de la liste des pokémons";	
};

angular.element(document).ready(function () {
		getAllPokemons();
});

}]);



app.controller('pokemonController', ['$scope', '$http', '$routeParams', '$location', function($scope,$http,$routeParams,$location) {
	
$scope.messages = [];
$scope.nbusers = 1;
$scope.url = $location.url();
var ws = null;
var username = null;	
var numero = null;	
$scope.loaded = false;
		
ws = new WebSocket("ws://" + location.host + "/");
console.log("--Websocket créée");

ws.onmessage = function (event) {
	var message = JSON.parse(event.data);
	var type = message.type;
	console.log("> Message reçu de type "+type);
	switch(type){
		case 'init':
			username = message.username;
			ws.send(JSON.stringify({
				type: 'init',
				numero: numero 
			}));
			console.log("< Envoi d'un message de type Init");
			break;

		
		case 'newUser':
			$scope.nbusers = message.nbusers;
			$scope.$apply();
			break;

		case 'message':
			$scope.messages.push(message);
			$scope.$apply();
			break;
	}
};




$scope.sendMessage = function(){
	var message = $scope.message;
	ws.send(JSON.stringify({
		username: username,
		numero: numero,
		type: 'message',
		message: message
	}));
	console.log("< Envoi d'un message de type Message");
	$scope.message = "";
};

getPokemon = function(nom) {
	$scope.loaded=false;
	$http.get('/pokemon/'+nom+'/').
	  success(function(data, status, headers, config) {
	    readData(data);
	    $scope.loaded = true;    
	  }).
	  error(function(data, status, headers, config) {
	  	    this.displayError();
	  	    $scope.loaded = true;	   
	  });
};

readData = function(data) {	
		if (data.length == 0) {
			$scope.errorMessage = "Aucun pokémon correspondant à ce nom n'a été trouvé";
		} else {
			$scope.errorMessage = undefined;
		}
		;
        $scope.pokemon = data[0];
        numero = parseInt(data[0].numéro,10);
};

	
this.displayError = function() {			
	$scope.errorMessage = "Erreur lors de la récupération de la liste des pokémons";	
};


getPokemon($routeParams.nomPokemon);

}]);


app.controller('rapportController', ['$scope', '$http', '$location', function($scope,$http,$location) {

}]);

app.filter('num', function () {
  return function (item) {
      return parseInt(item, 10);
  };
});


app.directive('preloader', [function(){
	return {
		restrict: 'E',
		templateUrl: '../html/components/preloader.html'
	};
}]);

app.directive('pokemon', [function(){
	return {
		restrict: 'E',
		templateUrl: '../html/components/pokemon.html'
	};
}]);

