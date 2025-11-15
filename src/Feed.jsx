import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Comments from "./Comments";
import "./Feed.css";

export default function Feed({ lastUpdated }) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});

  const loadPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, [lastUpdated]);

  const toggleLike = (postId) => {
    setLikes((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const openComments = (post) => {
    setSelectedPost(post);
    setShowComments(true);
  };

  return (
    <div className="feed-container">
      <h2>Feed</h2>

      {loading && <div className="feed-status">Carregando posts...</div>}
      {!loading && posts.length === 0 && (
        <div className="feed-status">Nenhuma experiência compartilhada ainda.</div>
      )}

      {posts.map((post) => (
        <div className="post-card fade-in" key={post.id}>
          {post.imageUrl && (
            <img src={post.imageUrl} className="post-image" alt="Post" />
          )}

          <p className="post-desc">{post.description}</p>

          <div className="post-actions">
            <span
              className="like-btn"
              onClick={() => toggleLike(post.id)}
            >
              {likes[post.id] ? "❤️ Curtido" : "🤍 Curtir"}
            </span>

            <span
              className="comment-btn"
              onClick={() => openComments(post)}
            >
              💬 Comentários
            </span>
          </div>
        </div>
      ))}

      {showComments && (
        <Comments post={selectedPost} close={() => setShowComments(false)} />
      )}
    </div>
  );
}
