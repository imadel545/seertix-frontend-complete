// src/lib/socket.js
import { io } from "socket.io-client";

let socket = null;

/**
 * Connexion au serveur Socket.io avec token d'authentification.
 * @param {string} token - JWT valide stocké côté client.
 * @returns {Socket} - Instance du socket connecté.
 */
export const connectSocket = (token) => {
  if (!token) {
    console.warn("🔒 Token manquant pour connexion Socket.io !");
    return null;
  }

  // Évite les connexions multiples
  if (!socket) {
    socket = io("http://localhost:5050", {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 8000,
    });

    window.SeertixSocket = socket; // pour debug via console

    socket.on("connect", () => {
      console.log("✅ Socket connecté :", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠ Socket déconnecté :", reason);
      if (reason === "io server disconnect") {
        console.log("Tentative de reconnexion forcée...");
        socket.connect();
      }
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Erreur connexion socket :", err.message);
    });

    // Log tous les événements reçus (utile pour debug)
    socket.onAny((event, ...args) => {
      console.log(`[📡] Événement reçu : '${event}'`, ...args);
    });
  }

  return socket;
};

/**
 * Récupère l'instance active du socket.
 * @returns {Socket|null}
 */
export const getSocket = () => {
  if (!socket) {
    console.warn("⚠ Aucune connexion socket active !");
  }
  return socket;
};

/**
 * Déconnecte le socket proprement.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔌 Socket.io déconnecté manuellement.");
  }
};
