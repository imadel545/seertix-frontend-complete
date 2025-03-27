"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    const { name, email, password } = formData;
    if (name.trim().length < 2)
      return "Le nom doit contenir au moins 2 caractères.";
    if (!email.includes("@")) return "Adresse email invalide.";
    if (password.length < 6)
      return "Le mot de passe doit contenir au moins 6 caractères.";
    return null;
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
      if (!res.ok)
        throw new Error(data.error || "Erreur lors de l’inscription.");

      // Connexion auto
      const loginRes = await fetch("http://localhost:5050/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok)
        throw new Error("Inscription réussie mais connexion échouée.");

      localStorage.setItem("token", loginData.token);
      toast.success("Bienvenue sur Seertix 🚀");

      setTimeout(() => router.push("/profile"), 1000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center px-4">
      <Toaster />
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 fade-in">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white text-center mb-6">
          ✨ Créer un compte
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nom complet
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-800 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Jean Dupont"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Adresse Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-800 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="exemple@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-800 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Création en cours..." : "🚀 Créer mon compte"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600 dark:text-gray-400">
          Déjà membre ?{" "}
          <Link
            href="/login"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
