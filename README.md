# 🏠 Real Estate AI Predictor

Pipeline **MLOps end-to-end** de prédiction de prix immobiliers, du notebook d'entraînement jusqu'au déploiement d'une API en production, avec une interface web interactive.

🔗 **Démo live** : [real-estate-ai-project-seven.vercel.app](https://real-estate-ai-project-seven.vercel.app/)
📚 **Documentation API (Swagger)** : [real-estate-ai-project-l5aw.onrender.com/docs](https://real-estate-ai-project-l5aw.onrender.com/docs)

> ⚠️ L'API tourne sur un plan gratuit Render : elle se met en veille après 15 min d'inactivité. Le premier appel peut donc prendre 30 à 50 secondes le temps qu'elle se "réveille".

---

## 📋 Description

Ce projet prédit le prix médian d'un logement en Californie à partir de caractéristiques du quartier (localisation, revenu médian, nombre de pièces, proximité de l'océan, etc.), en s'appuyant sur le dataset **California Housing**.

L'objectif était de construire un pipeline complet et réaliste : pas seulement un notebook de Data Science, mais une vraie chaîne MLOps avec un modèle versionné, exposé via une API, et consommé par une interface utilisateur déployée en production.

## 🚀 Fonctionnalités

- **Data Science** : nettoyage des données (valeurs manquantes, encodage de variable catégorielle), analyse exploratoire (EDA), entraînement et benchmark de deux modèles (Régression Linéaire vs Random Forest), évaluation via RMSE.
- **MLOps** : sérialisation et versioning du modèle retenu avec Joblib, compression pour optimiser la taille du fichier.
- **Backend** : API REST performante avec FastAPI, validation des entrées via Pydantic, documentation interactive automatique (Swagger).
- **Frontend** : interface moderne et responsive en Next.js et Tailwind CSS pour l'estimation interactive.
- **Déploiement** : CI/CD automatique — backend sur Render, frontend sur Vercel, redéploiement à chaque `git push`.

## 🛠️ Stack technique

| Catégorie | Technologies |
|---|---|
| **Machine Learning** | Scikit-Learn, Pandas, NumPy, Joblib |
| **Backend / API** | FastAPI, Uvicorn, Pydantic |
| **Frontend** | Next.js, TypeScript, Tailwind CSS |
| **Déploiement** | Vercel (frontend), Render (backend) |

## 📁 Structure du projet

```
real-estate-ai-project/
├── backend/              # API FastAPI
│   ├── main.py
│   ├── modele_immobilier_rf.joblib
│   ├── colonnes_features.joblib
│   └── requirements.txt
├── frontend/             # Interface Next.js
│   └── app/
│       └── page.tsx
└── notebooks/            # Entraînement du modèle (EDA, benchmark, sauvegarde)
    └── Real_Estate_Prediction_Model.ipynb
```

## 📊 Résultats du benchmark

| Modèle | RMSE |
|---|---|
| Régression Linéaire | ~70 060 $ |
| **Random Forest** 🏆 | **~49 998 $** |

Le Random Forest réduit l'erreur de prédiction d'environ **29 %** par rapport à la régression linéaire simple, et a donc été retenu pour la mise en production.

## ⚙️ Lancer le projet en local

**Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
L'API est alors disponible sur `http://127.0.0.1:8000` (documentation sur `/docs`).

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
Crée un fichier `.env.local` dans `frontend/` avec :
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

## 🔮 Pistes d'amélioration

- Feature engineering additionnel (ex: ratio pièces/foyer, distance aux grandes villes).
- Normalisation des features pour améliorer la stabilité du modèle.
- Test d'algorithmes de Gradient Boosting (XGBoost, LightGBM).
- Ajout d'un pipeline scikit-learn (`Pipeline`) pour unifier prétraitement + modèle en un seul objet sérialisé.