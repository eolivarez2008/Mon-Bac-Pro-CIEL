# MON BAC PRO CIEL – Website

Bienvenue sur le dépôt **Mon Bac Pro CIEL** créé par Emilien.

**Mon Bac Pro CIEL** est un site web francophone dédié à la présentation du bac professionnel Cybersécurité, Informatique, Électronique et Réseaux, développé dans le cadre d'un projet scolaire débuté en **2025**.

Ce site propose une immersion complète dans le thème du **Bac Pro CIEL**, à travers différentes rubriques :

- **Formation** : pour comprendre le bac pro
- **Débouchés** : présentation des métiers et études supérieurs disponibles après le bac  
- **Projets** : une présentation structurée des projets fait par les élèves  
- **Stages** : des informations et conseils pour les stages
- **Témoignages** : affichage dynamique et formulaire de soumission avec modération admin

---

## Déploiement & Architecture

Le projet est entièrement containerisé et repose sur une architecture micro-services gérée par **Docker Compose**.

- **Infrastructure** : Docker & Docker Compose
- **Serveur Web** : Nginx (Alpine)
- **Tunneling & Sécurité** : Cloudflare Tunnel (Zero Trust)
- **CI/CD** : Déploiement via Git & Docker Compose

**Accès au site :** [https://monbacprociel.eolivarez.site](https://monbacprociel.eolivarez.site)  

---

## Installation et Configuration

1. Clonage du projet

```bash
git clone https://github.com/eolivarez2008/Mon-Bac-Pro-CIEL.git
cd Mon-Bac-Pro-CIEL
```

2. Configuration des variables d'environnement

Création du fichier .env à la racine du projet

```env
UMAMI_ID=votre_id_umami_ici
```

---

## Stack Technique

Le projet utilise une architecture moderne séparant le contenu statique de la logique métier dynamique.

- **Structure & sémantique** : [HTML5](https://developer.mozilla.org/fr/docs/Web/HTML) — Organisation des pages, hiérarchisation du contenu et intégration des médias.
- **Mise en forme & responsive design** : [CSS3](https://developer.mozilla.org/fr/docs/Web/CSS) & [Bootstrap 5](https://getbootstrap.com/) — Mise en page, animations légères, adaptation multi-écrans.
- **Logique côté client** : [JavaScript (ES6+)](https://developer.mozilla.org/fr/docs/Web/JavaScript) — Manipulation du DOM, interactions dynamiques, gestion des données JSON.
- **Hébergement & Infra** : [Docker](https://www.docker.com/) — Containerisation du site statique avec un serveur Nginx optimisé, auto-hébergé sur une VM dédiée.
- **Réseau & Sécurité** : [Cloudflare Tunnel](https://www.cloudflare.com/products/tunnel/) — Exposition sécurisée du service sans ouverture de ports (Zero Trust), protection contre les attaques et gestion automatique du certificat SSL.
- **Gestion du formulaire de témoignage** : [Formspree](https://formspree.io/) — Traitement des soumissions sans backend personnalisé.
- **Icônes UI** : [Pictogrammers](https://pictogrammers.com/library/mdi/) — Intégration des pictogrammes vectoriels issus de la librairie Pictogrammers pour une interface cohérente et scalable.
- **Web analytics** : [Umami](https://umami.is/) — Solution open-source d’analyse d’audience, légère et respectueuse de la vie privée, auto-hébergée.
- **Format de données** : [JSON](https://www.json.org/json-fr.html) — Structuration des lycées et des témoignages.

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
