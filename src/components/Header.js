"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout, loading } = useAuth();

  useEffect(() => {
    // Préchargement possible ici si besoin
  }, [pathname]);

  if (loading) {
    return (
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 text-center">
          <span className="animate-pulse text-white text-sm">
            Chargement de la session...
          </span>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-blue-600 text-white py-4 shadow-md transition-all z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link href="/">
          <span className="text-3xl font-bold cursor-pointer hover:text-gray-100 transition">
            🚀 Seertix
          </span>
        </Link>

        {isAuthenticated ? (
          <nav className="flex items-center space-x-6">
            <Link href="/profile" className="hover:text-gray-200 transition">
              👤 {user?.name || "Profil"}
            </Link>
            <Link href="/advice" className="hover:text-gray-200 transition">
              💡 MyVue
            </Link>
            <button
              onClick={logout}
              className="text-sm bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition text-white font-semibold"
            >
              🚪 Déconnexion
            </button>
          </nav>
        ) : (
          <nav className="flex items-center space-x-6">
            <Link href="/login" className="hover:text-gray-200 transition">
              🔐 Connexion
            </Link>
            <Link href="/register" className="hover:text-gray-200 transition">
              ✍️ Inscription
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
