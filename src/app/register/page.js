"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    const { name, email, password } = formData;
    if (name.trim().length < 2) return "Le nom est trop court.";
    if (!email.includes("@")) return "Email invalide.";
    if (password.length < 6) return "Mot de passe trop court.";
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateInputs();
    if (error) return toast.error(error);

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5050/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur d’inscription.");

      // Connexion automatique
      await login(formData.email, formData.password);

      toast.success("Compte créé et connecté !");
      setTimeout(() => router.push("/profile"), 1000);
    } catch (err) {
      toast.error(err.message || "Erreur de création du compte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100 px-4">
      <Toaster />
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">✨ Crée ton compte</h1>
          <p className="text-gray-500 mt-1">Et entre dans la légende Seertix.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nom complet
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Ton nom"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Adresse Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-semibold rounded-lg text-white transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-wait"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Création en cours..." : "🚀 Créer mon compte"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Déjà membre ?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
