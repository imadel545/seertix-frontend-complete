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

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      setCanReceiveAdvice(
        localStorage.getItem("hasSubmittedAdvice") === "true"
      );
    }
  }, [token]);

  const validateContent = (text) =>
    text.trim().length >= 3 && text.trim().length <= 300;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateContent(content)) {
      return toast.error("Le conseil doit contenir entre 3 et 300 caractères.");
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
      if (!res.ok) throw new Error(data.error || "Erreur serveur.");

      toast.success(data.message || "Conseil soumis avec succès !");
      setContent("");
      setRandomAdvice(null);
      setCanReceiveAdvice(true);
      localStorage.setItem("hasSubmittedAdvice", "true");
    } catch (err) {
      toast.error(err.message || "Erreur de soumission.");
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  const handleGetRandom = async () => {
    if (!canReceiveAdvice) return;

    setLoading((prev) => ({ ...prev, random: true }));

    try {
      const res = await fetch("http://localhost:5050/advice/random", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur.");

      setRandomAdvice(data);
      toast.success("Voici un conseil aléatoire 🎯");
      setCanReceiveAdvice(false);
      localStorage.setItem("hasSubmittedAdvice", "false");
    } catch (err) {
      toast.error(err.message || "Erreur récupération.");
    } finally {
      setLoading((prev) => ({ ...prev, random: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 py-12 px-4">
      <Toaster />
      <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 shadow-xl rounded-xl p-8 space-y-8 fade-in">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center">
          💡 Partage un Conseil & Reçois-en Un
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Écris un conseil utile, motivant ou inspirant..."
            className="w-full h-32 border-2 border-gray-300 dark:border-zinc-700 rounded-lg p-4 text-gray-800 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-400 resize-none"
          />
          <button
            type="submit"
            disabled={loading.submit}
            className={`w-full py-3 rounded-xl text-white font-bold transition ${
              loading.submit
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading.submit
              ? "Soumission en cours..."
              : "✍️ Soumettre mon conseil"}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={handleGetRandom}
            disabled={!canReceiveAdvice || loading.random}
            className={`mt-4 py-3 px-6 rounded-xl text-white font-bold transition ${
              !canReceiveAdvice || loading.random
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading.random
              ? "Chargement..."
              : "🎲 Recevoir un conseil aléatoire"}
          </button>
          {!canReceiveAdvice && (
            <p className="text-sm mt-2 text-gray-500">
              (Soumets un conseil pour en recevoir un autre)
            </p>
          )}
        </div>

        {randomAdvice && (
          <div className="mt-8 bg-indigo-50 dark:bg-zinc-800 border border-indigo-200 dark:border-zinc-600 p-6 rounded-xl shadow-sm animate-fade-in">
            <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
              🎉 Conseil Reçu
            </h2>
            <p className="text-gray-800 dark:text-white whitespace-pre-wrap mb-2">
              {randomAdvice.content}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Par{" "}
              <span
                onClick={() => router.push(`/user/${randomAdvice.author_id}`)}
                className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {randomAdvice.owner_name || "Auteur"}
              </span>{" "}
              • {new Date(randomAdvice.created_at).toLocaleString()}
            </p>

            <div className="mt-4 flex gap-4">
              <button
                onClick={() => router.push(`/user/${randomAdvice.author_id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition"
              >
                Voir le profil
              </button>
              <button
                onClick={() => router.push(`/advice/${randomAdvice.id}`)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium transition"
              >
                Voir & commenter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
