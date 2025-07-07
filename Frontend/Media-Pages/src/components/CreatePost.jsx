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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await addPost(
        titleRef.current.value,
        bodyRef.current.value,
        reactionsRef.current.value || 0,
        tagsRef.current.value.split(" ").filter(tag => tag.trim() !== "")
      );
      
      // Reset form
      titleRef.current.value = "";
      bodyRef.current.value = "";
      reactionsRef.current.value = "";
      tagsRef.current.value = "";
      setSuccess(true);
      
    } catch (err) {
      setError(err.message);
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