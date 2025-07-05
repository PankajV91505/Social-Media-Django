import { useEffect, useState } from 'react';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/posts/');
      if (!response.ok) throw new Error('Network response was not ok');
      
      const result = await response.json();
      if (result.status === 'success') {
        setPosts(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch posts');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="post-list">
      <h2>Recent Posts ({posts.length})</h2>
      {posts.map(post => (
        <div key={post.id} className="post-card">
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          <div className="post-meta">
            <span>By: {post.user?.username || 'Anonymous'}</span>
            <span>Likes: {post.reactions}</span>
            <span>Tags: {post.tags.join(', ')}</span>
            <span>Posted: {new Date(post.created_at).toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;