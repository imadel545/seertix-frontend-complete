"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { API_ROUTES, authHeaders } from "@/constants/api";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(API_ROUTES.AUTH_PROFILE, {
        headers: authHeaders(token),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur.");
      setProfile(data);
    } catch (err) {
      toast.error(err.message || "Échec chargement profil.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 dark:from-zinc-900 dark:to-gray-800 px-4 py-12">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 relative"
      >
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition"
        >
          🚪 Déconnexion
        </button>

        {loading ? (
          <SkeletonProfile />
        ) : profile ? (
          <ProfileContent profile={profile} />
        ) : (
          <p className="text-red-600 font-medium text-sm text-center">
            Impossible de charger le profil utilisateur.
          </p>
        )}
      </motion.div>
    </div>
  );
}

function SkeletonProfile() {
  return (
    <div className="space-y-4 animate-pulse">
      <Skeleton circle height={64} width={64} />
      <Skeleton height={24} width="60%" />
      <Skeleton height={20} width="40%" />
      <Skeleton count={4} height={16} />
    </div>
  );
}

function ProfileContent({ profile }) {
  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <img
          src={
            profile.photo ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              profile.name
            )}`
          }
          alt="Avatar"
          className="w-16 h-16 rounded-full border-2 border-indigo-500"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {profile.name}
          </h1>
          <p className="text-gray-500 text-sm">{profile.email}</p>
        </div>
      </div>

      <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
        <p>
          <strong>UUID :</strong> {profile.id}
        </p>
        {profile.bio && (
          <p>
            <strong>Bio :</strong> {profile.bio}
          </p>
        )}
        {profile.pays && (
          <p>
            <strong>Pays :</strong> {profile.pays}
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4">
          <StatsCard label="Conseils" value="0" color="indigo" />
          <StatsCard label="Commentaires" value="0" color="purple" />
        </div>
      </div>

      <div className="mt-8 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition"
        >
          ✏️ Modifier mon profil (bientôt)
        </motion.button>
      </div>
    </>
  );
}

function StatsCard({ label, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`bg-${color}-50 dark:bg-${color}-900 p-4 rounded-xl text-center shadow`}
    >
      <h3
        className={`text-lg font-semibold text-${color}-700 dark:text-${color}-300`}
      >
        {value}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
    </motion.div>
  );
}
