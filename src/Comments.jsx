import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./Comments.css";

export default function Comments({ post, close }) {

  if (!post) return null;

  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!post?.id) return; 

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

    const channel = supabase
      .channel("comments-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments" },
        (payload) => {
          if (payload.new.post_id === post.id) {
            setComments((prev) => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [post?.id]);

  const sendComment = async () => {
    if (!text.trim()) return;

    await supabase.from("comments").insert({
      text,
      post_id: post.id,
      created_at: new Date(),
    });

    setText("");
  };

  return (
    <div className="modal-bg">
      <div className="modal">
        <button className="close-btn" onClick={close}>✖</button>

        {post?.imageUrl && (
          <img src={post.imageUrl} alt="post" className="modal-img" />
        )}

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
