import { useContext, useState, useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri"; // ✅ Modern delete icon
import { PostList as PostListContext } from "../store/Post-list-store1";

const Post = ({ post }) => {
  const { deletePost, updatePost, username } = useContext(PostListContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showFullBody, setShowFullBody] = useState(false);
  const [editedPost, setEditedPost] = useState({
    title: post.title,
    body: post.body,
    reactions: post.reactions,
    tags: Array.isArray(post.tags)
      ? post.tags.join(' ')
      : typeof post.tags === 'string'
      ? post.tags
      : ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setEditedPost({
      title: post.title,
      body: post.body,
      reactions: post.reactions,
      tags: Array.isArray(post.tags)
        ? post.tags.join(' ')
        : typeof post.tags === 'string'
        ? post.tags
        : ''
    });
    setError(null);
  }, [post, isEditing]);

  const handleSave = async () => {
    if (!editedPost.title.trim() || !editedPost.body.trim()) {
      setError("Title and content cannot be empty");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const postData = {
        title: editedPost.title,
        body: editedPost.body,
        reactions: Number(editedPost.reactions) || 0,
        tags: editedPost.tags
          .split(' ')
          .map(tag => tag.trim())
          .filter(tag => tag !== '')
      };

      const success = await updatePost(post.id, postData);

      if (!success) {
        throw new Error("Failed to update post");
      }

      setIsEditing(false);
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost(post.id);
    }
  };

  const isOwner = post.username === username;

  return (
    <div className="card post-card mb-4">
      <div className="card-body">

        {isEditing ? (
          <>
            {error && <div className="alert alert-danger mb-3">{error}</div>}

            <div className="mb-3">
              <label className="form-label">Title*</label>
              <input
                className={`form-control ${error && !editedPost.title.trim() ? 'is-invalid' : ''}`}
                value={editedPost.title}
                onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Content*</label>
              <textarea
                className={`form-control ${error && !editedPost.body.trim() ? 'is-invalid' : ''}`}
                rows="4"
                value={editedPost.body}
                onChange={(e) => setEditedPost({ ...editedPost, body: e.target.value })}
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Reactions</label>
                <input
                  type="number"
                  className="form-control"
                  value={editedPost.reactions}
                  onChange={(e) => setEditedPost({ ...editedPost, reactions: e.target.value })}
                  min="0"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Tags (space separated)</label>
                <input
                  className="form-control"
                  value={editedPost.tags}
                  onChange={(e) => setEditedPost({ ...editedPost, tags: e.target.value })}
                  placeholder="e.g. react js django"
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <button
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={isSaving || !editedPost.title.trim() || !editedPost.body.trim()}
              >
                {isSaving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* ✅ Title */}
            <h5 className="card-title">{post.title}</h5>

            {/* ✅ Username */}
            <p className="text-muted mb-2">
              Posted by <strong>{post.username || "Unknown"}</strong>
            </p>

            {/* ✅ Content with Read More */}
            <p className="card-text my-3">
              {showFullBody || post.body.length <= 100
                ? post.body
                : post.body.slice(0, 100) + '... '}
              {post.body.length > 100 && !showFullBody && (
                <button className="btn btn-link p-0" onClick={() => setShowFullBody(true)}>
                  Read more
                </button>
              )}
            </p>

            {/* ✅ Date/Time */}
            <small className="text-muted d-block mb-2">
              {new Date(post.updated_at || post.created_at).toLocaleString()}
            </small>

            {/* ✅ Tags */}
            <div className="d-flex flex-wrap gap-2 mb-2">
              {(Array.isArray(post.tags)
                ? post.tags
                : typeof post.tags === 'string'
                ? post.tags.split(' ')
                : []
              ).map((tag) => (
                <span key={tag} className="badge bg-primary">#{tag}</span>
              ))}
            </div>

            {/* ✅ Reactions and Buttons */}
            <div className="d-flex justify-content-between align-items-center">
              <span className="badge bg-success">
                {post.reactions} reactions
              </span>

              {isOwner && (
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setIsEditing(true)}
                    title="Edit post"
                  >
                    <AiFillEdit />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={handleDelete}
                    title="Delete post"
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Post;
