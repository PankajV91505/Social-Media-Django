import { useEffect, useState } from 'react';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsAuth, setNeedsAuth] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      setNeedsAuth(false);
      
      const response = await fetch('http://localhost:8000/api/posts/', {
        credentials: 'include' // Send cookies if available
      });
      
      if (response.status === 401 || response.status === 403) {
        setNeedsAuth(true);
        throw new Error('Please login to view posts');
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts (Status: ${response.status})`);
      }

      const data = await response.json();
      setPosts(Array.isArray(data) ? data : data.data || []);
      
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
          <a 
            href="/login" 
            className="btn btn-sm btn-primary ms-3"
          >
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
      <h2 className="mb-4">Recent Posts ({posts.length})</h2>
      
      {posts.length === 0 ? (
        <div className="alert alert-info">
          No posts available
        </div>
      ) : (
        <div className="row g-4">
          {posts.map(post => (
            <div key={post.id} className="col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title">{post.title}</h3>
                  <p className="card-text">{post.body}</p>
                  <div className="text-muted small mt-2">
                    <span>By: {post.user?.username || 'Anonymous'}</span>
                    <span className="ms-2">❤️ {post.reactions || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;