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

  // Add this function to get CSRF token
  const getCSRFToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
  };

  // REPLACE YOUR EXISTING handleSubmit WITH THIS:
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/posts/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(),
        },
        credentials: 'include',
        body: JSON.stringify({
          title: titleRef.current.value,
          body: bodyRef.current.value,
          reactions: reactionsRef.current.value || 0,
          tags: tagsRef.current.value.split(" ").filter(tag => tag.trim() !== ""),
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      // Make sure your addPost function matches these parameters
      addPost(data.id, data.title, data.body, data.reactions, data.tags);
      
      // Reset form
      titleRef.current.value = "";
      bodyRef.current.value = "";
      reactionsRef.current.value = "";
      tagsRef.current.value = "";

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
      
      {/* ADD THIS ERROR DISPLAY */}
      {error && (
        <div className="alert alert-danger mb-3">
          {error}
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
            placeholder="Enter tags separated by spaces"
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;