"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier la connexion de l'utilisateur
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchProfile(token);
    }
  }, [router]);

  const fetchProfile = async (token) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5050/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de la récupération du profil.");
      } else {
        setProfile(data);
      }
    } catch (err) {
      setError("Erreur lors de la connexion au serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mon Profil</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-600"
          >
            Déconnexion
          </button>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </div>
        ) : error ? (
          <p className="text-red-500 font-semibold">{error}</p>
        ) : profile ? (
          <div className="space-y-4">
            <p>
              <span className="font-bold text-gray-700">ID :</span> {profile.id}
            </p>
            <p>
              <span className="font-bold text-gray-700">Nom :</span>{" "}
              {profile.name}
            </p>
            <p>
              <span className="font-bold text-gray-700">Email :</span>{" "}
              {profile.email}
            </p>
            {/* Vous pouvez ajouter ici les conseils soumis/reçus ultérieurement */}
          </div>
        ) : (
          <p className="text-gray-700">Aucune information à afficher.</p>
        )}
      </div>
    </div>
  );
}
