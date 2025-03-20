"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5050/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Identifiants incorrects.");
      }

      localStorage.setItem("token", data.token);
      toast.success("Connexion réussie ! 🚀");

      setTimeout(() => router.push("/profile"), 1000);
    } catch (err) {
      toast.error(err.message || "Échec de connexion. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 px-4">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 transition duration-300 transform hover:scale-105">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            🔐 Connexion à Seertix
          </h2>
          <p className="text-gray-500 mt-2">
            Connectez-vous pour accéder à votre espace personnel.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <label htmlFor="email" className="text-gray-600 font-medium">
              📧 Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="ton.email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="text-gray-600 font-medium">
              🔑 Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-semibold transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-wait"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
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
                Connexion...
              </>
            ) : (
              "🚀 Se connecter"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Pas encore inscrit ?{" "}
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-800 font-semibold transition"
            >
              Crée un compte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
