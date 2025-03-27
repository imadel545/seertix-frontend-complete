"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, HeartOff, MessageCircle, Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { getSocket } from "@/lib/socket";

export default function CommentCard({ comment, userId, token, onReplyClick }) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Number(comment.like_count || 0));
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showConfirm, setShowConfirm] = useState(false);
  const isOwner = userId === comment.user_id;

  useEffect(() => {
    setIsLiked(comment.liked_by_current_user || false);
    setLikeCount(Number(comment.like_count || 0));
  }, [comment]);

  const toggleLike = async () => {
    try {
      const endpoint = isLiked ? "unlike" : "like";
      const res = await fetch(
        `http://localhost:5050/comment/${comment.id}/${endpoint}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setIsLiked(!isLiked);
      setLikeCount((prev) => prev + (isLiked ? -1 : 1));
    } catch (err) {
      toast.error("Erreur lors du like: " + err.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5050/comment/${comment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editedContent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Commentaire modifié ✅");
      setIsEditing(false);
      getSocket()?.emit("comment:update", data);
    } catch (err) {
      toast.error("Erreur modification: " + err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5050/comment/${comment.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Commentaire supprimé 🗑️");
      getSocket()?.emit("comment:delete", { commentId: comment.id });
    } catch (err) {
      toast.error("Erreur suppression: " + err.message);
    } finally {
      setShowConfirm(false);
    }
  };

  const goToUserProfile = () => {
    router.push(`/user/${comment.user_id}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 mb-4 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start">
        <div className="w-full">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <button
              onClick={goToUserProfile}
              className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              {comment.user_name}
            </button>{" "}
            • {new Date(comment.created_at).toLocaleString()}
          </p>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 text-sm dark:bg-gray-700 dark:text-white"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleUpdate}
                  className="px-3 py-1 text-white bg-green-600 rounded-md hover:bg-green-700 text-sm"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-gray-900 dark:text-white whitespace-pre-wrap">
              {comment.content}
            </p>
          )}
        </div>

        {isOwner && !isEditing && (
          <div className="flex gap-2 ml-2">
            <button onClick={() => setIsEditing(true)} title="Modifier">
              <Pencil className="w-4 h-4 text-yellow-600 hover:text-yellow-800" />
            </button>
            <button onClick={() => setShowConfirm(true)} title="Supprimer">
              <Trash2 className="w-4 h-4 text-red-600 hover:text-red-800" />
            </button>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="flex space-x-6 mt-4 items-center">
          <button
            onClick={toggleLike}
            title={isLiked ? "Annuler le like" : "Liker ce commentaire"}
            className="flex items-center text-sm text-gray-600 hover:text-red-500 dark:text-gray-400"
          >
            {isLiked ? (
              <Heart className="w-4 h-4 fill-red-500 mr-1" />
            ) : (
              <HeartOff className="w-4 h-4 mr-1" />
            )}
            {likeCount} Like{likeCount !== 1 && "s"}
          </button>

          <button
            onClick={() => onReplyClick(comment.id)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            <MessageCircle className="w-4 h-4 mr-1" /> Répondre
          </button>
        </div>
      )}

      {showConfirm && (
        <ConfirmModal
          message="Voulez-vous vraiment supprimer ce commentaire ?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
