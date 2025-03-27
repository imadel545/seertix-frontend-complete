"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function PublicProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [advices, setAdvices] = useState([]);
  const [loading, setLoading] = useState(true);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      fetchProfile();
    }
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5050/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUser(data);
      if (data.id) await fetchAdvices(data.id);
    } catch (err) {
      toast.error("❌ Profil introuvable ou erreur serveur");
      console.error(err.message);
      setLoading(false);
    }
  };

  const fetchAdvices = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5050/advice`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const userAdvices = data.filter((a) => a.author_id === userId);
      setAdvices(userAdvices);
    } catch (err) {
      toast.error("❌ Erreur lors du chargement des conseils");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
        <Loader2 className="animate-spin w-6 h-6 text-indigo-600 mr-2" />
        <p className="text-lg font-medium text-gray-700">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-medium text-red-600">
          Utilisateur non trouvé ❌
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100 py-10 px-4">
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={
              user.photo ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.username
              )}`
            }
            alt="Avatar"
            className="w-20 h-20 rounded-full border-2 border-indigo-500"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              👤 {user.username}
            </h1>
            <p className="text-gray-600 text-sm">{user.bio || "Aucune bio"}</p>
            <p className="text-sm text-gray-500 mt-1">
              📅 Membre depuis le{" "}
              {new Date(user.created_at).toLocaleDateString("fr-FR")}
            </p>
            {user.pays && (
              <p className="text-sm text-gray-500">🌍 {user.pays}</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          💡 Conseils publiés
        </h2>

        {advices.length === 0 ? (
          <p className="text-gray-500 text-center">
            Cet utilisateur n'a encore publié aucun conseil.
          </p>
        ) : (
          <ul className="space-y-4">
            {advices.map((advice) => (
              <li
                key={advice.id}
                className="bg-white shadow-sm hover:shadow-md border border-gray-200 rounded-xl p-4 cursor-pointer transition"
                onClick={() => router.push(`/advice/${advice.id}`)}
              >
                <p className="text-gray-900 whitespace-pre-wrap">
                  {advice.content}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  🕒 Publié le{" "}
                  {new Date(advice.created_at).toLocaleString("fr-FR")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
