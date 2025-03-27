"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import CommentCard from "@/components/CommentCard";
import CommentForm from "@/components/CommentForm";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { API_ROUTES, authHeaders } from "@/constants/api";

export default function AdviceDetailPageWrapper() {
  return (
    <ProtectedRoute>
      <AdviceDetailPage />
    </ProtectedRoute>
  );
}

function AdviceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [advice, setAdvice] = useState(null);
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = user?.token;
  const userId = user?.userId;

  // === Initialisation
  useEffect(() => {
    if (!token || !id) return;

    fetchAdvice();
    fetchComments();

    const socket = connectSocket(token);
    socket.emit("joinRoom", `advice_${id}`);
    socket.on("comment:new", fetchComments);
    socket.on("comment:update", fetchComments);
    socket.on("comment:delete", fetchComments);

    return () => {
      disconnectSocket();
    };
  }, [id, token]);

  // === Récupère le conseil
  const fetchAdvice = async () => {
    try {
      const res = await fetch(`${API_ROUTES.ADVICE}/${id}`, {
        headers: authHeaders(token),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAdvice(data);
    } catch {
      toast.error("Erreur lors du chargement du conseil.");
    }
  };

  // === Récupère les commentaires
  const fetchComments = async () => {
    try {
      const res = await fetch(`${API_ROUTES.COMMENT}/${id}`, {
        headers: authHeaders(token),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setComments(data);
    } catch {
      toast.error("Erreur lors du chargement des commentaires.");
    }
  };

  // === Ajout de commentaire
  const handleCommentSubmit = async (text) => {
    setLoading(true);
    try {
      const res = await fetch(API_ROUTES.COMMENT, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({
          content: text,
          adviceId: id,
          parentCommentId: replyTo,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Commentaire ajouté ✅");
      getSocket()?.emit("comment:new", { adviceId: id, comment: data });
      setReplyTo(null);
    } catch (err) {
      toast.error(err.message || "Erreur lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  // === Organisation des commentaires en arborescence
  const organizeComments = useCallback(() => {
    const map = {};
    const tree = [];

    comments.forEach((c) => {
      c.replies = [];
      map[c.id] = c;
    });

    comments.forEach((c) => {
      if (c.parent_comment_id && map[c.parent_comment_id]) {
        map[c.parent_comment_id].replies.push(c);
      } else {
        tree.push(c);
      }
    });

    return tree;
  }, [comments]);

  const handleReply = (commentId) => setReplyTo(commentId);
  const handleCancelReply = () => setReplyTo(null);

  const renderCommentThread = (list, depth = 0) =>
    list.map((comment) => (
      <div key={comment.id} className={`ml-${depth * 4} mt-4`}>
        <CommentCard
          comment={comment}
          userId={userId}
          token={token}
          onReplyClick={handleReply}
        />
        {comment.replies?.length > 0 &&
          renderCommentThread(comment.replies, depth + 1)}
      </div>
    ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <Toaster />

      {advice && (
        <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
            Conseil #{advice.id}
          </h1>
          <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
            {advice.content}
          </p>
          <p className="text-sm mt-4 text-gray-500 dark:text-gray-400">
            Par{" "}
            <span
              onClick={() => router.push(`/user/${advice.author_id}`)}
              className="text-indigo-600 hover:underline cursor-pointer"
            >
              {advice.owner_name || "Auteur"}
            </span>{" "}
            • {new Date(advice.created_at).toLocaleString()}
          </p>
        </div>
      )}

      <div className="max-w-3xl mx-auto mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          💬 Commentaires
        </h2>

        <CommentForm
          adviceId={id}
          token={token}
          replyTo={replyTo}
          onCommentAdded={fetchComments}
          onCancelReply={handleCancelReply}
          loading={loading}
        />

        <div className="mt-6">
          {comments.length === 0 ? (
            <p className="text-gray-600 text-center dark:text-gray-400">
              Aucun commentaire pour le moment.
            </p>
          ) : (
            renderCommentThread(organizeComments())
          )}
        </div>
      </div>
    </div>
  );
}
