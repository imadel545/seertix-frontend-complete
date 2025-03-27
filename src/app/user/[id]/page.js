"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";
import { API_ROUTES } from "@/constants/api";

export default function UserPublicPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [advices, setAdvices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${API_ROUTES.USER_PUBLIC}/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur.");
      setUser(data.user);
      setAdvices(data.advices);
    } catch (err) {
      toast.error(err.message || "Échec de chargement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-gray-100 to-indigo-100 dark:from-zinc-900 dark:to-gray-800">
      <Toaster />
      <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-6">
        {loading ? (
          <SkeletonUser />
        ) : user ? (
          <>
            <div className="flex items-center gap-4 mb-6">
              <img
                src={
                  user.photo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name
                  )}`
                }
                alt="Avatar"
                className="w-16 h-16 rounded-full border-2 border-indigo-500"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {user.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Inscrit le{" "}
                  {new Date(user.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              {user.bio && (
                <p>
                  <strong>Bio :</strong> {user.bio}
                </p>
              )}
              {user.pays && (
                <p>
                  <strong>Pays :</strong> {user.pays}
                </p>
              )}
            </div>

            <hr className="my-6 border-gray-200 dark:border-gray-700" />

            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              💡 Ses conseils
            </h2>

            {advices.length === 0 ? (
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Cet utilisateur n’a pas encore publié de conseils.
              </p>
            ) : (
              <ul className="space-y-4">
                {advices.map((advice) => (
                  <motion.li
                    key={advice.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-xl shadow-sm cursor-pointer transition"
                    onClick={() => router.push(`/advice/${advice.id}`)}
                  >
                    <p className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap">
                      {advice.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-2 dark:text-gray-400">
                      Posté le{" "}
                      {new Date(advice.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </motion.li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="text-center text-red-500">Utilisateur introuvable.</p>
        )}
      </div>
    </div>
  );
}

function SkeletonUser() {
  return (
    <div className="space-y-4 animate-pulse">
      <Skeleton circle height={64} width={64} />
      <Skeleton height={24} width="60%" />
      <Skeleton height={16} width="40%" />
      <Skeleton count={4} height={12} />
    </div>
  );
}
