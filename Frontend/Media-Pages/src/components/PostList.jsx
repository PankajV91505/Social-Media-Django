import { useContext, useEffect, useState } from "react";
import { PostList as PostListContext } from "../store/Post-list-store1";
import Post from "./Post";
import { useNavigate } from "react-router-dom";

const PostList = () => {
  const { postList, addInitialPosts, token } = useContext(PostListContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch("http://localhost:8000/api/posts/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      addInitialPosts(data);
    } catch (err) {
      setError(err.message);
      setTimeout(() => navigate("/login"), 2000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPosts();
  }, [token]);

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-primary">📄 All Posts</h2>

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" />
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}

      {!loading && postList.length === 0 && (
        <div className="alert alert-info text-center">
          No posts yet. Create your first post!
        </div>
      )}

      <div className="row g-4">
        {postList.map((post) => (
          <div key={post.id} className="col-md-6 col-lg-4">
            <Post post={post} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
