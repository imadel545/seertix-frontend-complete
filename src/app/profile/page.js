"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchProfile(token);
    }
  }, [router]);

  const fetchProfile = async (token) => {
    setError("");
    try {
      const res = await fetch("http://localhost:5050/auth/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la récupération du profil.");
      }
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mon Profil</h1>
          <button onClick={handleLogout} className="text-red-500 hover:text-red-600">
            Déconnexion
          </button>
        </div>
        {isLoading ? (
          <Skeleton count={4} height={20} />
        ) : error ? (
          <p className="text-red-500 font-semibold">{error}</p>
        ) : (
          <div className="space-y-4">
            <p><strong className="text-gray-700">ID :</strong> {profile.id}</p>
            <p><strong className="text-gray-700">Nom :</strong> {profile.name}</p>
            <p><strong className="text-gray-700">Email :</strong> {profile.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}
