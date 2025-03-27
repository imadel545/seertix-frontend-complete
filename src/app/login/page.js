"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    router.prefetch("/profile");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trimStart() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5050/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Identifiants incorrects.");

      localStorage.setItem("token", data.token);
      toast.success("Connexion réussie 🚀");

      setTimeout(() => router.push("/profile"), 1000);
    } catch (err) {
      toast.error(err.message || "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center px-4">
      <Toaster />
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 fade-in">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white text-center mb-6">
          🔐 Connexion
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-800 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="votre.email@example.com"
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
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-800 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Connexion en cours..." : "🚀 Se connecter"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600 dark:text-gray-400">
          Pas encore inscrit ?{" "}
          <Link
            href="/register"
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            Crée un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
