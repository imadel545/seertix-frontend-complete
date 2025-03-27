// src/lib/socketEvents.js

/**
 * Enregistre tous les événements socket une fois connecté.
 * @param {Socket} socket - instance socket.io
 */
export const registerSocketEvents = (socket) => {
  if (!socket) return;

  socket.on("connect", () => {
    console.log("✅ Socket connecté :", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.warn("⚠️ Déconnecté :", reason);
    if (reason === "io server disconnect") {
      console.log("🔁 Tentative de reconnexion forcée...");
      socket.connect();
    }
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Erreur socket :", err.message);
  });

  socket.onAny((event, ...args) => {
    console.log(`[📡] Événement : '${event}'`, ...args);
  });
};
