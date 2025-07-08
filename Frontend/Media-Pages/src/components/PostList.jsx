import { useContext, useEffect, useState } from 'react';
import { PostList as PostListContext } from '../store/Post-list-store1';
import Post from './Post';
import { useNavigate } from 'react-router-dom';

const PostList = () => {
  const { postList, addInitialPosts, token } = useContext(PostListContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8000/api/posts/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error('Please login to view posts');
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch posts (Status: ${response.status})`);
      }

      const data = await response.json();
      const posts = Array.isArray(data) ? data : data.data || [];
      addInitialPosts(posts);  // ✅ Add posts to context

    } catch (err) {
      setError(err.message);
      console.error('Fetch posts error:', err);

      if (err.message.includes('login')) {
        setTimeout(() => navigate('/login'), 1500);
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [token]);

  if (loading) return (
    <div className="text-center my-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="container my-4">
      <div className="alert alert-warning d-flex justify-content-between align-items-center">
        <span>{error}</span>
        <button
          onClick={fetchPosts}
          className="btn btn-sm btn-outline-secondary"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="container my-4">
      <h2 className="mb-4">Recent Posts ({postList.length})</h2>

      {postList.length === 0 ? (
        <div className="alert alert-info">
          No posts available
        </div>
      ) : (
        <div className="row g-4">
          {postList.map(post => (
            <div key={post.id} className="col-md-6 col-lg-4">
              <Post post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
