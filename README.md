# FindMyTeam
FindMyTeam est une application web full-stack qui aide les utilisateurs à trouver et gérer les collaborations d'équipe.

## Projet en cours de création !

## 📁 Structure du Projet

### Frontend
- **Framework**: React + TypeScript + Vite
- **Fonctionnalités clés**:
    - Authentification utilisateur (page de connexion)
    - Carrousel interactif
    - Vue cartographique (Carte)
    - Fonctionnalité de chat
    - Gestion du compte utilisateur (mon-compte)
    - Panneau d'administration (Gestion)
    - Système de navigation
    - Gestion des erreurs avec page 404

### Backend
- **Runtime**: Node.js
- **Serveur**: Express.js
- **Stockage des données**: Fichiers JSON
    - `users.json` - Données utilisateurs
    - `missions.json` - Données des missions/tâches

## 🚀 Démarrage rapide

1. **Frontend**:
     ```bash
     cd frontend
     npm install
     npm run dev
     ```

2. **Backend**:
     ```bash
     cd backend
     npm install
     node server.js
     ```

## 📋 Fonctionnalités

- Authentification et gestion de compte utilisateur
- Navigation des missions/équipes sur une carte interactive
- Chat en temps réel entre membres d'équipe
- Tableau de bord administratif
- Système de permissions utilisateur

## ⚙️ Configuration

Frontend et backend utilisent des fichiers `.env` pour la configuration environnementale.

**Frontend** (`.env`):
```
VITE_API_KEY=votreAPIkey
VITE_API_URL=http://votreURL
```

**Backend** (`.env`):
```
API_KEY=votreAPIkey
```

