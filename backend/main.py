from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal
import joblib
import pandas as pd

# 1. Initialisation de l'app
app = FastAPI(
    title="API de Prédiction Immobilière",
    description="Une API MLOps pour prédire le prix des maisons en Californie",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Chargement du modèle et des colonnes (ordre exact utilisé à l'entraînement)
modele = joblib.load('modele_immobilier_rf.joblib')
colonnes = joblib.load('colonnes_features.joblib')

# 3. Schéma d'entrée — reflète les vraies colonnes du nouveau dataset
class MaisonInput(BaseModel):
    longitude: float
    latitude: float
    housing_median_age: float
    total_rooms: float
    total_bedrooms: float
    population: float
    households: float
    median_income: float
    ocean_proximity: Literal["<1H OCEAN", "INLAND", "ISLAND", "NEAR BAY", "NEAR OCEAN"]

@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API de Prédiction Immobilière de Zeineb !"}

@app.post("/predict")
def predict_price(data: MaisonInput):
    data_dict = data.dict()
    ocean_proximity_value = data_dict.pop("ocean_proximity")

    df = pd.DataFrame([data_dict])

    # Reconstruit le one-hot encoding exactement comme à l'entraînement
    for col in colonnes:
        if col.startswith("ocean_proximity_"):
            df[col] = 1 if col == f"ocean_proximity_{ocean_proximity_value}" else 0

    # Réordonne les colonnes pour matcher exactement l'ordre d'entraînement
    df = df.reindex(columns=colonnes, fill_value=0)

    prix_estime = modele.predict(df)[0]

    return {
        "prix_estime_usd": round(float(prix_estime), 2),
        "devise": "USD"
    }