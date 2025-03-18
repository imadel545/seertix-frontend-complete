"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Redirige si déjà connecté
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/profile");
    }
  }, [router]);

  const validateForm = () => {
    if (!credentials.email || !credentials.password) {
      toast.error("Veuillez remplir tous les champs.");
      return false;
    }
    if (credentials.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5050/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || "Erreur d'authentification.");

      localStorage.setItem("token", data.token);
      toast.success("Connexion réussie ! Redirection...");
      router.push("/profile");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      <Toaster position="top-center" />
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🔐 Connexion à Seertix
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-2"
            >
              📧 Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full px-4 py-3 border-2 rounded-lg border-gray-300 focus:border-blue-500 outline-none transition"
              placeholder="email@exemple.com"
              value={credentials.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-2"
            >
              🔑 Mot de passe
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full px-4 py-3 border-2 rounded-lg border-gray-300 focus:border-blue-500 outline-none transition"
              placeholder="••••••••"
              value={credentials.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 text-white font-bold rounded-lg transition duration-300 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "🔄 Connexion en cours..." : "🚀 Se connecter"}
          </button>
        </form>

        <p className="mt-5 text-sm text-center text-gray-600">
          Pas encore inscrit ?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline font-semibold"
          >
            Crée un compte
          </a>
        </p>
      </div>
    </div>
  );
}
