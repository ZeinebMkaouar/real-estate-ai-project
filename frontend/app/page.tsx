"use client";
import { useState } from "react";

// Champs numériques
const FIELDS: { name: string; label: string; hint: string }[] = [
  { name: "longitude", label: "Longitude", hint: "ex: -122.23" },
  { name: "latitude", label: "Latitude", hint: "ex: 37.88" },
  { name: "housing_median_age", label: "Âge médian du logement (années)", hint: "ex: 41" },
  { name: "total_rooms", label: "Nombre total de pièces", hint: "ex: 880" },
  { name: "total_bedrooms", label: "Nombre total de chambres", hint: "ex: 129" },
  { name: "population", label: "Population du secteur", hint: "ex: 322" },
  { name: "households", label: "Nombre de foyers", hint: "ex: 126" },
  { name: "median_income", label: "Revenu médian (10k$)", hint: "ex: 8.32" },
];

// Options pour la proximité de l'océan
const OCEAN_PROXIMITY_OPTIONS = [
  { value: "<1H OCEAN", label: "À moins d'1h de l'océan" },
  { value: "INLAND", label: "À l'intérieur des terres" },
  { value: "ISLAND", label: "Île" },
  { value: "NEAR BAY", label: "Près de la baie" },
  { value: "NEAR OCEAN", label: "Près de l'océan" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function Home() {
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData(e.currentTarget);

    // Les champs numériques sont convertis en Number, ocean_proximity reste une string
    const data: Record<string, number | string> = {};
    formData.forEach((value, key) => {
      data[key] = key === "ocean_proximity" ? String(value) : Number(value);
    });

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`Erreur API (${response.status}) : ${detail}`);
      }

      const json = await response.json();
      setResult(json.prix_estime_usd);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur de connexion avec l'API"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold mb-1">Estimateur de Prix Immobilier 🏠</h1>
        <p className="text-sm text-gray-500 mb-6">
          Modèle Random Forest entraîné sur le dataset California Housing —
          projet de démonstration.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FIELDS.map(({ name, label, hint }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                name={name}
                type="number"
                step="any"
                required
                placeholder={hint}
                className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          ))}

          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proximité de l'océan
            </label>
            <select
              name="ocean_proximity"
              required
              defaultValue=""
              className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="" disabled>
                Sélectionner une option
              </option>
              {OCEAN_PROXIMITY_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="col-span-1 sm:col-span-2 bg-blue-600 text-white p-3 rounded-md mt-2 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? "Calcul en cours..." : "Estimer le prix"}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {result !== null && (
          <div className="mt-6 p-4 bg-green-50 border border-green-300 text-green-800 rounded-md text-center">
            <p className="text-sm text-green-600 mb-1">Prix estimé</p>
            <p className="text-2xl font-bold">
              {result.toLocaleString("en-US", { style: "currency", currency: "USD" })}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}