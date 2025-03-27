// src/lib/socket.js
import { io } from "socket.io-client";
import { registerSocketEvents } from "./socketEvents";

let socket = null;

/**
 * Connecte le client au serveur socket.io avec token JWT.
 * @param {string} token
 * @returns {Socket|null}
 */
export const connectSocket = (token) => {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    console.warn("🔒 Token JWT invalide.");
    return null;
  }

  if (!socket) {
    socket = io("http://localhost:5050", {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 8000,
    });

    registerSocketEvents(socket);

    window.SeertixSocket = socket;
  }

  return socket;
};

/**
 * Vérifie si le socket est connecté.
 * @returns {boolean}
 */
export const isConnected = () => socket && socket.connected;

/**
 * Récupère l'instance du socket.
 * @returns {Socket|null}
 */
export const getSocket = () => {
  if (!socket) console.warn("⚠ Socket non initialisé !");
  return socket;
};

/**
 * Déconnecte proprement le socket.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔌 Socket.io déconnecté.");
  }
};
