import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./Comments.css";
import "./Feed.css";

export default function Comments({ post, close }) {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);

  // Buscar comentários + realtime
  useEffect(() => {
    if (!post?.id) return; // evita erro de undefined

    const loadComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", post.id)
        .order("created_at", { ascending: true });

      if (!error) {
        setComments(data);
      }
    };

    loadComments();

    // Realtime para novos comentários
    const channel = supabase
      .channel("comments-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${post.id}`,
        },
        (payload) => {
          setComments((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [post]);

  // Enviar comentário
  const sendComment = async () => {
    if (!text.trim()) return;

    const { error } = await supabase.from("comments").insert({
      text,
      post_id: post.id,
      created_at: new Date(),
    });

    if (!error) setText("");
  };

  return (
    <div className="modal-bg">
      <div className="modal">
        <button className="close-btn" onClick={close}>✖</button>

        <img src={post.imageUrl} alt="post" className="modal-img" />

        <div className="modal-comments">
          {comments.map((c) => (
            <p key={c.id}>💬 {c.text}</p>
          ))}
        </div>

        <div className="modal-input">
          <input
            placeholder="Escreva um comentário..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="send" onClick={sendComment}>Enviar</button>
        </div>
      </div>
    </div>
  );
}
