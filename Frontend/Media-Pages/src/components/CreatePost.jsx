import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostList } from "../store/Post-list-store1";

const CreatePost = () => {
  const { addPost } = useContext(PostList);
  const titleRef = useRef();
  const bodyRef = useRef();
  const reactionsRef = useRef();
  const tagsRef = useRef();
  const navigate = useNavigate();

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
        tagsRef.current.value.split(" ").filter((tag) => tag.trim() !== "")
      );

      setSuccess(true);
      setTimeout(() => navigate("/"), 2000); // redirect after 2 seconds
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4 d-flex justify-content-center">
      <div className="card shadow-lg w-100" style={{ maxWidth: "600px" }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4 text-primary">✍️ Create New Post</h3>

          {error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}

          {success && (
            <div className="alert alert-success text-center">
              Post created successfully! Redirecting to home...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label fw-semibold">Post Title</label>
              <input
                type="text"
                ref={titleRef}
                className="form-control rounded-pill"
                id="title"
                required
                minLength="3"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="body" className="form-label fw-semibold">Post Content</label>
              <textarea
                ref={bodyRef}
                className="form-control"
                id="body"
                rows="5"
                required
                minLength="10"
              />
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="reactions" className="form-label fw-semibold">Reactions</label>
                <input
                  type="number"
                  ref={reactionsRef}
                  className="form-control rounded-pill"
                  id="reactions"
                  min="0"
                  defaultValue="0"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="tags" className="form-label fw-semibold">Tags</label>
                <input
                  type="text"
                  ref={tagsRef}
                  className="form-control rounded-pill"
                  id="tags"
                  placeholder="e.g. react js django"
                />
              </div>
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary rounded-pill"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Creating...
                  </>
                ) : (
                  "Create Post"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
