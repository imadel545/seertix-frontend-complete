"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUser(!!token);
  }, [pathname]);

  const handleLogout = () => {
    if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      localStorage.clear();
      router.push("/login");
    }
  };

  const navItems = [
    { name: "Accueil", path: "/", icon: "🏠" },
    { name: "Profil", path: "/profile", icon: "👤" },
    { name: "MyVue", path: "/advice", icon: "💡" },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 shadow-lg">
      <div className="container mx-auto px-4 flex flex-wrap justify-between items-center">
        <Link href="/">
          <span className="text-3xl font-extrabold cursor-pointer tracking-tight">
            🚀 Seertix
          </span>
        </Link>

        <nav className="flex items-center space-x-8">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <span
                className={`flex items-center gap-2 transition-transform duration-200 hover:scale-105 ${
                  pathname === item.path
                    ? "text-yellow-300 font-semibold"
                    : "hover:text-gray-200"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.name}
              </span>
            </Link>
          ))}

          {user && (
            <button
              onClick={handleLogout}
              aria-label="Déconnexion"
              className="flex items-center gap-2 transition-transform duration-200 hover:scale-105 hover:text-gray-200"
            >
              <span className="text-xl">🚪</span> Déconnexion
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
