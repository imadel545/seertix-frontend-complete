"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function AdvicePage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [randomAdvice, setRandomAdvice] = useState(null);
  const [loading, setLoading] = useState({ submit: false, random: false });
  const [canReceiveAdvice, setCanReceiveAdvice] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Vérifier si l'utilisateur est connecté au montage du composant
  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      setCanReceiveAdvice(localStorage.getItem("hasSubmittedAdvice") === "true");
    }
  }, [router, token]);

  // Vérification du texte soumis
  const validateContent = (text) => {
    const trimmed = text.trim();
    return trimmed.length >= 3 && trimmed.length <= 300;
  };

  /**
   * Soumission d’un conseil
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateContent(content)) {
      toast.error("Le conseil doit contenir entre 3 et 300 caractères.");
      return;
    }

    setLoading((prev) => ({ ...prev, submit: true }));

    try {
      const res = await fetch("http://localhost:5050/advice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: content.trim() }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erreur serveur inconnue.");

      toast.success(data.message || "Conseil soumis avec succès !");
      setContent("");

      // Activer la possibilité de recevoir un conseil
      localStorage.setItem("hasSubmittedAdvice", "true");
      setCanReceiveAdvice(true);
      setRandomAdvice(null); // Réinitialiser le conseil précédent
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  /**
   * Récupération d’un conseil aléatoire
   */
  const handleGetRandom = async () => {
    if (!canReceiveAdvice) return;

    setLoading((prev) => ({ ...prev, random: true }));

    try {
      const res = await fetch("http://localhost:5050/advice/random", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erreur serveur inconnue.");

      setRandomAdvice(data);
      toast.success("Conseil reçu avec succès !");
      
      // Désactiver la possibilité de recevoir un autre conseil sans nouvelle soumission
      localStorage.setItem("hasSubmittedAdvice", "false");
      setCanReceiveAdvice(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, random: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center py-12">
      <Toaster position="top-right" />
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl p-8 transition duration-500 ease-in-out transform hover:scale-105">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Partage un Conseil
          </h1>
          <button
            onClick={() => {
              localStorage.clear();
              router.push("/login");
            }}
            className="text-red-500 hover:text-red-700 transition"
          >
            Déconnexion
          </button>
        </div>

        {/* Zone de saisie du conseil */}
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Écris ton conseil ici..."
            className="w-full h-36 resize-none border-2 border-gray-300 rounded-xl p-4 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 transition"
          />

          <button
            type="submit"
            disabled={loading.submit}
            className={`mt-4 w-full py-3 rounded-xl text-white font-bold ${
              loading.submit
                ? "bg-gray-400 cursor-wait"
                : "bg-blue-600 hover:bg-blue-700"
            } transition`}
          >
            {loading.submit ? "Envoi en cours..." : "Envoyer mon conseil"}
          </button>
        </form>

        <hr className="my-6 border-gray-200" />

        {/* Bouton pour recevoir un conseil aléatoire */}
        <button
          onClick={handleGetRandom}
          disabled={!canReceiveAdvice || loading.random}
          className={`w-full py-3 rounded-xl font-bold text-white ${
            !canReceiveAdvice || loading.random
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          } transition`}
        >
          {loading.random ? "Chargement..." : "Recevoir un conseil aléatoire"}
        </button>

        {!canReceiveAdvice && (
          <p className="text-sm text-gray-500 text-center mt-2">
            (Soumets d'abord un conseil pour débloquer)
          </p>
        )}

        {/* Affichage du conseil reçu */}
        {randomAdvice && (
          <div className="mt-6 bg-indigo-50 border border-indigo-200 p-6 rounded-xl shadow-sm animate-fade-in">
            <h2 className="text-xl font-bold text-indigo-700 mb-3">
              🎉 Conseil Reçu
            </h2>
            <p className="text-gray-900">
              <strong>ID :</strong> {randomAdvice.id}
            </p>
            <p className="text-gray-900">
              <strong>Auteur :</strong> {randomAdvice.owner_name}
            </p>
            <p className="text-gray-900">
              <strong>Contenu :</strong> {randomAdvice.content}
            </p>
            <p className="text-gray-900">
              <strong>Date :</strong>{" "}
              {new Date(randomAdvice.created_at).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
