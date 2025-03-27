"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import CommentCard from "@/components/CommentCard";
import CommentForm from "@/components/CommentForm";
import { connectSocket, disconnectSocket } from "@/lib/socket";

export default function AdviceDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [advice, setAdvice] = useState(null);
  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    decodeToken();
    fetchAdvice();
    fetchComments();

    const socket = connectSocket(token);
    socket.emit("joinRoom", `advice_${id}`);

    socket.on("comment:new", fetchComments);
    socket.on("comment:update", fetchComments);
    socket.on("comment:delete", fetchComments);

    return () => disconnectSocket();
  }, [id]);

  const decodeToken = () => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.userId);
    } catch (err) {
      console.error("❌ Erreur décodage token :", err.message);
    }
  };

  const fetchAdvice = async () => {
    try {
      const res = await fetch(`http://localhost:5050/advice/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAdvice(data);
    } catch {
      toast.error("Erreur chargement du conseil.");
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:5050/comment/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setComments(data);
    } catch {
      toast.error("Erreur chargement des commentaires.");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (text) => {
    try {
      const res = await fetch("http://localhost:5050/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: text,
          adviceId: id,
          parentCommentId: replyTo,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("💬 Commentaire ajouté !");
      setReplyTo(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

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

  const renderComments = (nodes, depth = 0) =>
    nodes.map((comment) => (
      <div key={comment.id} className={`ml-${depth * 4} mt-4`}>
        <CommentCard
          comment={comment}
          userId={userId}
          token={token}
          onReplyClick={() => setReplyTo(comment.id)}
        />
        {comment.replies?.length > 0 &&
          renderComments(comment.replies, depth + 1)}
      </div>
    ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <Toaster />
      {advice && (
        <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
            💡 Conseil #{advice.id}
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
              {advice.owner_name}
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
          onSubmit={handleCommentSubmit}
          loading={false}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
        />

        <div className="mt-6">
          {loading ? (
            <p className="text-center text-gray-400">Chargement...</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-600 text-center dark:text-gray-400">
              Aucun commentaire pour le moment.
            </p>
          ) : (
            renderComments(organizeComments())
          )}
        </div>
      </div>
    </div>
  );
}
