// src/app/page.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Préchargement des pages clés
    router.prefetch("/login");
    router.prefetch("/profile");
    router.prefetch("/advice");

    if (token) {
      toast.success("Bienvenue !");
      router.replace("/profile");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null;
}
