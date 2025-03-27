"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace("/profile");
  }, [isAuthenticated]);

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

      login(data.token); // ✅ Décode & enregistre via context
      toast.success("Connexion réussie 🚀");
      setTimeout(() => router.push("/profile"), 1000);
    } catch (err) {
      toast.error(err.message || "Échec de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 px-4">
      <Toaster />
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🔐 Connexion à Seertix
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-semibold rounded-lg text-white transition ${
              loading
                ? "bg-gray-400 cursor-wait"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Connexion..." : "🚀 Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            S’inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
