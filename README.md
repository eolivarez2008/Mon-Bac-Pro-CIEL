# MON BAC PRO CIEL – Website

Bienvenue sur le dépôt **Mon Bac Pro CIEL** créé par Emilien.

**Mon Bac Pro CIEL** est un site web francophone dédié à la présentation du bac professionnel Cybersécurité, Informatique, Electronique et réseaux; développé dans le cadre d'un projet scolaire réalisé en **2025**. 

**Important** : Ce site est **optimisé pour les ordinateurs de bureau uniquement**. L'accès depuis un téléphone ou une tablette n'est pas possible — un message s'affichera vous invitant à utiliser un PC.

Ce site propose une immersion complète dans le thème du **Bac Pro CIEL**, à travers différentes rubriques :

- **Formation** : pour comprendre le bac pro 
- **Debouchés** : présentation des métiers et études supérieurs disponibles après le bac  
- **Projets** : une présentation structurée des projets fait par les élèves  
- **Stages** : des informations et conseils pour les stages
- **Témoignages** : affichage et formulaire de témoignages

---

## Déploiement & Architecture

Le projet est containerisé avec **Docker** et auto-hébergé sur une VM via un reverse-proxy **Nginx**.

* **Infrastructure** : Docker & Docker Compose
* **Reverse Proxy** : Nginx (Hôte)
* **Tunneling & Sécurité** : Cloudflare Tunnel
* **CI/CD** : Déploiement manuel via `docker compose up --build`

**Accès au site :** [https://monbacprociel.eolivarez.site](https://monbacprociel.eolivarez.site)  

---

## Stack Technique

Le projet repose sur une architecture web front-end classique, avec une logique orientée contenu dynamique et hébergement sur serveur.

- **Structure & sémantique** :  [HTML5](https://developer.mozilla.org/fr/docs/Web/HTML) — Organisation des pages, hiérarchisation du contenu et intégration des médias.
- **Mise en forme & responsive design** : [CSS3](https://developer.mozilla.org/fr/docs/Web/CSS) — Mise en page, animations légères, adaptation multi-écrans.
- **Framework CSS** : [Bootstrap 5](https://getbootstrap.com/) — Système de grille responsive, composants UI préconstruits et normalisation cross-browser.
- **Logique côté client** : [JavaScript (ES6+)](https://developer.mozilla.org/fr/docs/Web/JavaScript) — Manipulation du DOM, interactions dynamiques, gestion des données JSON.
- **Hébergement & Infra** : [Docker](https://www.docker.com/) — Containerisation du site statique avec un serveur Nginx optimisé, auto-hébergé sur une VM dédiée.
- **Réseau & Sécurité** : [Cloudflare Tunnel](https://www.cloudflare.com/products/tunnel/) — Exposition sécurisée du service sans ouverture de ports (Zero Trust), protection contre les attaques et gestion automatique du certificat SSL.
- **Format de données** : JSON — Structuration des lycées et contenus dynamiques.

---

## Auteur

Développé par **Emilien Olivarez** – Étudiant en Bac Pro CIEL (ex-SN)  
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

```
Mon-Bac-Pro-CIEL
├─ api
│  ├─ Dockerfile
│  ├─ package-lock.json
│  ├─ package.json
│  └─ server.js
├─ docker-compose.yml
├─ Dockerfile
├─ LICENSE
├─ nginx.conf
├─ public
│  ├─ 404.html
│  ├─ assets
│  │  ├─ documents
│  │  │  ├─ Déploiement-pc-portable.pdf
│  │  │  ├─ Fiche-entente-2025.pdf
│  │  │  ├─ Frais-deplacement-2025.pdf
│  │  │  └─ PFMP-Cormon-25-26.pdf
│  │  ├─ images
│  │  │  ├─ cormontaigne.jpg
│  │  │  ├─ favicon.png
│  │  │  ├─ projet-infra.webp
│  │  │  ├─ stage.jpg
│  │  │  └─ vr-lycee.png
│  │  └─ videos
│  │     └─ presentation-ciel.mp4
│  ├─ components
│  │  ├─ footer.html
│  │  ├─ internet-modal.html
│  │  └─ navbar.html
│  ├─ data
│  │  └─ lycees.json
│  ├─ index.html
│  ├─ pages
│  │  ├─ debouches.html
│  │  ├─ formation.html
│  │  ├─ projets.html
│  │  ├─ stages.html
│  │  └─ temoignages.html
│  ├─ scripts
│  │  ├─ components-loader.js
│  │  ├─ desktop-only.js
│  │  ├─ login-internet.js
│  │  ├─ navbar.js
│  │  ├─ school-liste.js
│  │  └─ testimonials.js
│  └─ styles
│     ├─ debouches.css
│     ├─ formation.css
│     ├─ index.css
│     ├─ navbar.css
│     ├─ projets.css
│     ├─ styles.css
│     └─ temoignages.css
└─ README.md

```