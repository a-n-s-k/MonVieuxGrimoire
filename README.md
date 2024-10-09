# Mon Vieux Grimoire

Ce dépôt contient le backend de l'application Mon Vieux Grimoire : un site web de référencement et de notation de livres.

## Prérequis

Pour ce projet, j'ai utilisé :

-   Node.js (version v20.18.0)
-   npm (version 10.8.2)

## Installation

Suivez les étapes ci-dessous pour installer et configurer le projet localement :

1. Clonez ce dépôt sur votre machine :\
   `git clone https://github.com/a-n-s-k/MonVieuxGrimoire.git`

2. Installez les dépendances nécessaires avec la commande suivante :\
   `npm install`

## Configuration de la Base de Données

Avant de lancer le projet, assurez-vous d'avoir configuré votre base de données MongoDB. Vous pouvez suivre les étapes suivantes :

1. Accédez au site web de MongoDB https://www.mongodb.com/cloud/atlas/register et inscrivez-vous pour obtenir un compte.

2. Une fois que vous avez accès à votre tableau de bord, créez un cluster et configurez-le selon vos besoins.

3. Récupérez votre code URI sur MongoDB et ajoutez-le dans un fichier .env que vous créez à la racine du projet. Configurez les variables d'environnement suivantes (variables listées dans le fichier .env.example):

## Lancement du backend :

Lance l'application en mode développement, avec nodemon, compile l'application à chaque modification:\
`npm run dev`

Lancez l'application avec la commande suivante :\
`npm start`

L'application sera accessible à l'adresse http://localhost:4000. 

## Front-End

Le frontend de l'application est accessible dans le référentiel suivant :\
https://github.com/OpenClassrooms-Student-Center/P7-Dev-Web-livres

Pour l'utiliser, procédez comme suit :

1. Clonez le dépôt.
2. Exécutez `npm install` pour installer les dépendances du projet.\
3. Exécutez `npm start` pour démarrer le projet.\

L'application sera accessible à l'adresse http://localhost:3000.