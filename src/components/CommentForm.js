"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { getSocket } from "@/lib/socket";

export default function CommentForm({
  adviceId,
  parentId = null,
  token,
  onCommentAdded,
  loading = false,
  replyTo = null,
  onCancelReply = null,
}) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Le contenu ne peut pas être vide.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:5050/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          adviceId,
          parentCommentId: parentId,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi.");

      toast.success("💬 Commentaire publié !");
      setContent("");

      // 🔥 Émettre l’événement via Socket.io
      const socket = getSocket();
      if (socket && socket.connected) {
        socket.emit("comment:new", {
          adviceId,
          comment: data,
        });
      }

      if (onCommentAdded) onCommentAdded(data);
      if (onCancelReply) onCancelReply();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-4 space-y-2">
      <textarea
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
        rows={3}
        placeholder={
          parentId ? "Votre réponse..." : "Ajouter un commentaire..."
        }
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={submitting}
      />
      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={submitting}
          className={`px-6 py-2 rounded-lg font-semibold transition text-white ${
            submitting
              ? "bg-gray-400 cursor-wait"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {submitting ? "Envoi..." : parentId ? "Répondre" : "Commenter"}
        </button>
        {replyTo && onCancelReply && (
          <button
            type="button"
            onClick={onCancelReply}
            className="text-sm text-gray-600 hover:underline ml-4"
          >
            Annuler la réponse
          </button>
        )}
      </div>
    </form>
  );
}
