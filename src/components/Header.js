"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(false);

  useEffect(() => {
    setUser(!!localStorage.getItem("token"));
  }, [pathname]);

  const handleLogout = () => {
    if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      localStorage.clear();
      router.push("/login");
    }
  };

  return (
    <header className="bg-blue-600 text-white py-4 shadow-md transition-transform">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link href="/">
          <span className="text-3xl font-bold cursor-pointer">🚀 Seertix</span>
        </Link>
        <nav className="flex space-x-6">
          {user && <Link href="/profile"><span>👤 Profil</span></Link>}
          {user && <Link href="/advice"><span>💡 MyVue</span></Link>}
          {user && <button onClick={handleLogout}>🚪 Déconnexion</button>}
        </nav>
      </div>
    </header>
  );
}
