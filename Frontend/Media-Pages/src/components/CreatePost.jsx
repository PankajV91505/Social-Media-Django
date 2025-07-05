import { useContext, useRef, useState } from "react";
import { PostList } from "../store/Post-list-store1";

const CreatePost = () => {
  const { addPost } = useContext(PostList);
  const titleRef = useRef();
  const bodyRef = useRef();
  const reactionsRef = useRef();
  const tagsRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Function to get CSRF token from cookies
  const getCSRFToken = () => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    return cookieValue || '';
  };

  // Function to ensure CSRF token is set
  const ensureCSRFToken = async () => {
    try {
      await fetch("http://localhost:8000/api/csrf/", {
        method: 'GET',
        credentials: 'include'
      });
    } catch (err) {
      console.error("Failed to set CSRF token:", err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // First ensure we have a CSRF token
      await ensureCSRFToken();

      const response = await fetch("http://localhost:8000/api/posts/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(),
        },
        credentials: 'include', // Important for session/cookies
        body: JSON.stringify({
          title: titleRef.current.value,
          body: bodyRef.current.value,
          reactions: reactionsRef.current.value || 0,
          tags: tagsRef.current.value.split(" ").filter(tag => tag.trim() !== ""),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || 
          errorData.message || 
          `Failed to create post (Status: ${response.status})`
        );
      }

      const data = await response.json();
      addPost(data.id, data.title, data.body, data.reactions, data.tags);
      
      // Reset form and show success
      titleRef.current.value = "";
      bodyRef.current.value = "";
      reactionsRef.current.value = "";
      tagsRef.current.value = "";
      setSuccess(true);
      
    } catch (err) {
      setError(err.message);
      console.error("Post creation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create New Post</h2>
      
      {error && (
        <div className="alert alert-danger mb-3">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success mb-3">
          Post created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Post Title</label>
          <input
            type="text"
            ref={titleRef}
            className="form-control"
            id="title"
            required
            minLength="3"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="body" className="form-label">Post Content</label>
          <textarea
            ref={bodyRef}
            className="form-control"
            id="body"
            rows="4"
            required
            minLength="10"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="reactions" className="form-label">Reactions</label>
          <input
            type="number"
            ref={reactionsRef}
            className="form-control"
            id="reactions"
            min="0"
            defaultValue="0"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="tags" className="form-label">Tags</label>
          <input
            type="text"
            ref={tagsRef}
            className="form-control"
            id="tags"
            placeholder="Enter tags separated by spaces (e.g., tech django)"
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Creating...
            </>
          ) : (
            'Create Post'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;