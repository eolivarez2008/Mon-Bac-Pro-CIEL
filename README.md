<div align="center">

# Mon Bac Pro CIEL

A static website presenting the French vocational diploma in Cybersecurity, IT, Electronics & Networks (Bac Pro CIEL).

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Nginx](https://img.shields.io/badge/Nginx-Alpine-009639?logo=nginx&logoColor=white)](https://nginx.org/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Tunnel-F38020?logo=cloudflare&logoColor=white)](https://www.cloudflare.com/products/tunnel/)

**[Live Website](https://monbacprociel.eolivarez.site)**

</div>

---

## Project Status: Completed

This project was built, finalized, and validated as a core part of my high school curriculum. It is fully operational, stable, and successfully hosted.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Deployment & Infrastructure](#deployment--infrastructure)
- [Getting Started](#getting-started)
- [License](#license)

---

## Overview

**Mon Bac Pro CIEL** documents the Bac Pro CIEL curriculum — a French vocational track covering Cybersecurity, IT, Electronics, and Networks. It features a clean modular architecture, separating static frontend presentation from self-hosted analytics.

---

## Features

- **Formation** — curriculum overview and programme structure.
- **Débouchés** — career paths and higher education opportunities after graduation.
- **Projets** — structured showcase of student-built projects.
- **Stages** — practical guidance for internship periods.
- **Témoignages** — dynamic testimonials feed with submission form and admin moderation.

---

## Tech Stack

- **Core Frontend:** Built using core [HTML5](https://developer.mozilla.org/en/docs/Web/HTML), [CSS3](https://developer.mozilla.org/en/docs/Web/CSS), and vanilla [JavaScript ES6+](https://developer.mozilla.org/en/docs/Web/JavaScript) for DOM manipulation and dynamic JSON data handling.
- **UI Framework:** [Bootstrap 5](https://getbootstrap.com/) and [Pictogrammers MDI](https://pictogrammers.com/library/mdi/) vector icons for responsive layout.
- **Backend Utilities:** [Formspree](https://formspree.io/) integration for secure serverless form handling without exposing a custom backend.

---

## Deployment & Infrastructure

While the frontend relies on standard web technologies, the production deployment incorporates modern network and system administration practices:

- **Web Server:** Optimized **Nginx (Alpine)** serving static files, self-hosted on a dedicated VM.
- **Containerization:** The entire stack is containerized and automated using **Docker** and **Docker Compose**.
- **Zero Trust Network:** Securely exposed using a **Cloudflare Tunnel (Zero Trust)**. This architecture allows secure web hosting without opening any inbound ports on the local firewall, providing native DDoS mitigation and automated SSL/TLS management.
- **Privacy-First Analytics:** Integration of **Umami**, a lightweight, self-hosted, open-source analytics platform respectful of GDPR.

---

## Getting Started

### Development (Local Run)

To run the website locally and preserve proper routing, a local web server is required. Node.js must be installed on your machine.

1. Clone the repository:

```bash
git clone https://github.com/eolivarez2008/Mon-Bac-Pro-CIEL.git
cd Mon-Bac-Pro-CIEL
```

2. Install `serve` globally:

```bash
npm install -g serve
```

3. Start the development server:

```bash
serve -c serve.json public/
```

The site will be available at `http://localhost:3000`.

### Production Deployment

This repository provides pre-configured production files including `Dockerfile`, `docker-compose.yml`, and `nginx.conf`. You can choose your preferred deployment strategy:

#### Option A: Static Web Hosting (Netlify, Vercel, VPS...)

You can host the frontend directly on any static platform. Simply connect your **Umami** dashboard tracking ID to your analytics environment.

#### Option B: Self-Hosted Containerized Stack (Docker & Nginx)

To spin up the complete automated stack provided in this repository:

1. Ensure you have **Docker**, **Docker Compose** and **Nginx** installed on your server.
2. Create a `.env` file at the root to configure your analytics:

```env
UMAMI_ID=your_umami_site_id_here

```

3. Launch the infrastructure:

```bash
docker compose up -d

```

The site will be live locally on port `3002` (or the port defined in your configuration), ready to be routed behind Nginx and Cloudflare.

---

## License

Distributed under the **Apache 2.0 License** — see [LICENSE](LICENSE) for details.
