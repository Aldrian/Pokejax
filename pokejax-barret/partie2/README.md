#Pokéjax

Lancement : exécuter avec node le fichier server.js situé à la racine de l'application.

##Compte-Rendu de l'application

###Côté serveur
Le serveur utilise le framework nodeJs Express. Celui-ci est constitué de deux parties :

####Une API :
Le serveur accepte 4 routes, et chacune appelle un callback renvoyant des informations au client :

La route "/" renvoie la page d'index. 
La route "/pokemons/" appelle le callback "getAllPokemons" qui renvoie une version allégée du pokedex (poketri). 
La route "/search/:nom" appelle le callback "selectPokemons" qui renvoie la partie du poketri correspondant au nom dans l'URL. 
La route "/pokemon/:nom" appelle le callback "getPokemon" qui renvoie la partie du pokedex complet correspondant au nom dans l'URL. 
####Un serveur WebSocket :
Il utilise les variables suivantes :

La variable "chatroom" est un tableau à deux dimensions de la taille du pokédex. 
La variable "username" est un entier initialisé à 0 qui servira à déterminer le pseudonyme des utilisateurs 
Le serveur écoute les connexions entrantes et fonctionne sur le protocole suivant :

A la connexion d'un utilisateur, le serveur lui envoie un message de type init lui demandant de s'identifier, et lui envoie en même temps son nom d'utilisateur. 
L'utilisateur renvoie le numéro de la page sur laquelle il se trouve, et le serveur stocke la socket de l'utilisateur dans la case du tableau "chatroom" correspondant au numéro du pokémon. 
Le serveur envoie ensuite à tous les utilisateurs présents sur la page (et donc à toutes les socket de la case correspondantes) un message de type newUser contenant le nombre d'utilisateurs connectés mis à jour.
Ensuite, à chaque message reçu par le serveur, le serveur récupère dans le message le numéro de la page, et transmets le message à tous les utilisateurs correspondants. 
La gestion des déconnexions est gérée coté serveur :

A chaque parcours d'une des cases du tableau "chatroom", les actions critiques (push ou send) sont enveloppées dans des blocs try/catch. 
Si une erreur se produit, la socket correspondant à l'indice où s'est produit l'erreur est détruite. 
Le serveur envoie ensuite à tous les autres utilisateurs un message de type newUser contenant le nombre d'utilisateurs mis à jour. 
###Côté client
Le client est constitué d'une application AngularJS, et utilise pour le design le framework Materialize et du code CSS personnel.

A la réception de la page index envoyée par le serveur, l'application AngularJS démarre. Elle contient un module de routage associant des pages à un controlleur :

La route / appelle le template home et fait appel au controlleur "searchController". 
La route /pokemon/:nom appelle le template displayPokemon et fait appel au controlleur pokemonController. 
La route /rapport appelle le template rapport et fait appel au controlleur rapportController (vide, la page étant statique). 
####La page d'accueil :
Elle implémente la fonction d'autocomplétion (TP3)

Au chargement de la page, celle-ci appelle la fonction "getAllPokemon" qui va faire une requête XHR sur l'adresse "/pokemons/". 
Les pokémons reçus sont affichés sur la page sous la forme de cartes (template pokemon). 
Chaque carte contient les informations de base du pokemon (poketri) ainsi qu'un lien pour accéder à sa fiche. 
Un champ texte de recherche est disponible sur la barre de navigation. A chaque caractère rentré (onKeyUp) la fonction search(valeur) est appelée. 
La fonction recherche fait une requête au serveur, et celui-ci renvoie les pokémons correspondant à la saisie de l'utilisateur. 
Si des pokémons sont retournés, des cartes correspondant à chaque pokémons sont créées, remplaçant les précédentes. Sinon, un message d'erreur est affiché. 
####La fiche pokémon :
Elle contient les informations détaillées du pokémon, ainsi qu'une salle de discussion (TP4)

De la même manière que la page d'accueil, la fiche va faire une requête au serveur (adresse "/pokemon/nom") pour récupérer les informations du pokémon. 
Les informations sont affichées sur la page, et les attaques du pokémon sont itérées dans un tableau. 
A l'arrivée sur la page, une websocket vers le serveur est créée. Le comportement est décrit dans le chapitre concernant le serveur. 
Le champ de saisie appelle une fonction send(message) à sa validation. 
Chaque message reçu est affiché à la suite dans la fenêtre de chat. 