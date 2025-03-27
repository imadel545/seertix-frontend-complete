"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    // Précharger routes principales
    router.prefetch("/login");
    router.prefetch("/profile");
    router.prefetch("/advice");
  }, [pathname]);

  const handleLogout = () => {
    if (confirm("❓ Es-tu sûr de vouloir te déconnecter ?")) {
      localStorage.clear();
      setIsAuthenticated(false);
      router.push("/login");
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md py-4 transition-all">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-indigo-600 dark:text-indigo-400"
        >
          🚀 Seertix
        </Link>

        <nav className="flex items-center gap-6 text-gray-700 dark:text-gray-300 text-sm font-medium">
          {isAuthenticated && (
            <>
              <Link
                href="/profile"
                className="hover:text-indigo-500 transition"
              >
                👤 Profil
              </Link>
              <Link href="/advice" className="hover:text-indigo-500 transition">
                💡 MyVue
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 transition"
              >
                🚪 Déconnexion
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
