"use client";

import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { getSocket } from "@/lib/socket";
import { motion } from "framer-motion";

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
  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return toast.error("✍️ Le commentaire est vide !");

    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:5050/comment", {
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

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erreur inconnue.");

      toast.success("✅ Commentaire publié !");
      setContent("");

      const socket = getSocket();
      if (socket?.connected) {
        socket.emit("comment:new", { adviceId, comment: data });
      }

      onCommentAdded?.(data);
      onCancelReply?.();
    } catch (err) {
      toast.error(err.message || "Erreur lors de l’envoi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="my-4 space-y-2 animate-fade-in"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <label htmlFor="comment-text" className="sr-only">
        Écrire un commentaire
      </label>
      <textarea
        id="comment-text"
        ref={textareaRef}
        className="w-full p-3 border dark:border-gray-700 border-gray-300 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition"
        rows={3}
        placeholder={
          parentId ? "✏️ Votre réponse..." : "💬 Ajouter un commentaire..."
        }
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={submitting}
        aria-disabled={submitting}
        autoFocus={!!parentId}
      />

      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={submitting}
          className={`px-6 py-2 rounded-lg font-semibold transition text-white shadow ${
            submitting
              ? "bg-gray-400 cursor-wait"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {submitting
            ? "⏳ Envoi en cours..."
            : parentId
            ? "↪️ Répondre"
            : "💬 Commenter"}
        </button>

        {replyTo && onCancelReply && (
          <button
            type="button"
            onClick={onCancelReply}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition ml-4"
          >
            ❌ Annuler la réponse
          </button>
        )}
      </div>
    </motion.form>
  );
}
