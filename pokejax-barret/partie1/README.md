#TP4-Partie 1

Lancement : exécuter chacun des fichiers server.js situés dans les répertoires server1 et server2
Aller ensuite à l'adresse localhost:9090.

## Côté serveur

Rien de particulier, chaque serveur va au lancement renvoyer sa page statique.

## Côté client

### Page principale

La page principale contient deux eventlistener :

#### Onload 

Au chargement de la page, un queryselector est créé

#### Omessage

A la réception d'un message, on vérifie son origine. Si le message vient bien de la fenêtre fille, on l'affiche.
Sinon on affiche une alerte.

### Page secondaire

Au chargement, la page secondaire envoie un message à son parent.