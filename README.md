# MON BAC PRO CIEL – Website

Bienvenue sur le dépôt **Mon Bac Pro CIEL** créé par Emilien.

**Mon Bac Pro CIEL** est un site web francophone dédié à la présentation du bac professionnel Cybersécurité, Informatique, Électronique et Réseaux, développé dans le cadre d'un projet scolaire débuté en **2025**. 

**Important** : Ce site est **optimisé pour les ordinateurs de bureau uniquement**. L'accès depuis un téléphone ou une tablette n'est pas encore possible — un message s'affichera vous invitant à utiliser un PC.

Ce site propose une immersion complète dans le thème du **Bac Pro CIEL**, à travers différentes rubriques :

- **Formation** : pour comprendre le bac pro 
- **Débouchés** : présentation des métiers et études supérieurs disponibles après le bac  
- **Projets** : une présentation structurée des projets fait par les élèves  
- **Stages** : des informations et conseils pour les stages
- **Témoignages** : affichage dynamique et formulaire de soumission avec modération admin

---

## Déploiement & Architecture

Le projet est entièrement containerisé et repose sur une architecture micro-services gérée par **Docker Compose**.

* **Infrastructure** : Docker & Docker Compose
* **Serveur Web** : Nginx (Alpine) servant le front-end et agissant comme Reverse Proxy pour l'API
* **API Backend** : Node.js & Express
* **Base de données** : SQLite3 (Persistance via volumes Docker)
* **Tunneling & Sécurité** : Cloudflare Tunnel (Zero Trust)
* **CI/CD** : Déploiement automatisé/manuel via Git & Docker Compose

**Accès au site :** [https://monbacprociel.eolivarez.site](https://monbacprociel.eolivarez.site)  

---

## Stack Technique

Le projet utilise une architecture moderne séparant le contenu statique de la logique métier dynamique.

- **Structure & sémantique** : [HTML5](https://developer.mozilla.org/fr/docs/Web/HTML)
- **Mise en forme** : [CSS3](https://developer.mozilla.org/fr/docs/Web/CSS) & [Bootstrap 5](https://getbootstrap.com/)
- **Logique Client** : [JavaScript (ES6+)](https://developer.mozilla.org/fr/docs/Web/JavaScript) — Fetch API pour la communication avec le backend.
- **Backend API** : [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/) — Gestion des routes API, de la sécurité (Basic Auth) et de la modération.
- **Base de données** : [SQLite](https://sqlite.org/) — Stockage léger et performant des témoignages.
- **Hébergement & Infra** : [Docker](https://www.docker.com/) — Orchestration de deux services (Frontend & API) pour une isolation totale.
- **Réseau & Sécurité** : [Cloudflare Tunnel](https://www.cloudflare.com/products/tunnel/) — Exposition sécurisée sans ouverture de ports, SSL automatique.

---

## Auteur

Développé par **Emilien Olivarez** – Étudiant en Bac Pro CIEL  
Lycée Louis de Cormontaigne, Metz

---

## Licence

Ce projet est sous licence **Apache 2.0**. 
Tu peux :
- utiliser librement le code,
- le modifier,
- le distribuer,
- même à usage commercial,  
tant que tu respectes les conditions de la [licence Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0).