import { useContext, useEffect, useState } from 'react';
import { PostList as PostListContext } from '../store/Post-list-store1';
import Post from './Post';

const PostList = () => {
  const { postList, addInitialPosts } = useContext(PostListContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsAuth, setNeedsAuth] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      setNeedsAuth(false);
      
      const response = await fetch('http://localhost:8000/api/posts/', {
        credentials: 'include'
      });
      
      if (response.status === 401 || response.status === 403) {
        setNeedsAuth(true);
        throw new Error('Please login to view posts');
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts (Status: ${response.status})`);
      }

      const data = await response.json();
      const posts = Array.isArray(data) ? data : data.data || [];
      addInitialPosts(posts);
      
    } catch (err) {
      setError(err.message);
      console.error('Fetch posts error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return (
    <div className="text-center my-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="container my-4">
      <div className={`alert ${needsAuth ? 'alert-warning' : 'alert-danger'}`}>
        {error}
        {needsAuth && (
          <a href="/login" className="btn btn-sm btn-primary ms-3">
            Login
          </a>
        )}
        {!needsAuth && (
          <button 
            onClick={fetchPosts}
            className="btn btn-sm btn-outline-secondary ms-3"
          >
            Retry
          </button>
        )}
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