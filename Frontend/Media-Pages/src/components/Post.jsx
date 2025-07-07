import { useContext, useState, useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import { TiDelete } from "react-icons/ti";
import { PostList as PostListContext } from "../store/Post-list-store1";

const Post = ({ post }) => {
  const { deletePost, updatePost } = useContext(PostListContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({
    title: post.title,
    body: post.body,
    reactions: post.reactions,
    tags: post.tags ? post.tags.join(' ') : ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Reset form when post changes or editing starts
  useEffect(() => {
    setEditedPost({
      title: post.title,
      body: post.body,
      reactions: post.reactions,
      tags: post.tags ? post.tags.join(' ') : ''
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
        tags: editedPost.tags.split(' ').filter(tag => tag.trim() !== '')
      };

      console.log("Attempting to save:", postData);
      
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

  return (
    <div className="card post-card mb-4">
      <div className="card-body">
        {isEditing ? (
          <>
            {error && (
              <div className="alert alert-danger mb-3">
                {error}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Title*</label>
              <input
                className={`form-control ${error && !editedPost.title.trim() ? 'is-invalid' : ''}`}
                value={editedPost.title}
                onChange={(e) => setEditedPost({...editedPost, title: e.target.value})}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Content*</label>
              <textarea
                className={`form-control ${error && !editedPost.body.trim() ? 'is-invalid' : ''}`}
                rows="4"
                value={editedPost.body}
                onChange={(e) => setEditedPost({...editedPost, body: e.target.value})}
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Reactions</label>
                <input
                  type="number"
                  className="form-control"
                  value={editedPost.reactions}
                  onChange={(e) => setEditedPost({...editedPost, reactions: e.target.value})}
                  min="0"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Tags (space separated)</label>
                <input
                  className="form-control"
                  value={editedPost.tags}
                  onChange={(e) => setEditedPost({...editedPost, tags: e.target.value})}
                  placeholder="tech react django"
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
            <div className="d-flex justify-content-between align-items-start">
              <h5 className="card-title">{post.title}</h5>
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
                  onClick={() => {
                    if (window.confirm("Delete this post?")) {
                      deletePost(post.id);
                    }
                  }}
                  title="Delete post"
                >
                  <TiDelete />
                </button>
              </div>
            </div>
            
            <p className="card-text my-3">{post.body}</p>
            
            <div className="d-flex flex-wrap gap-2 mb-2">
              {post.tags?.map((tag) => (
                <span key={tag} className="badge bg-primary">
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                {new Date(post.created_at).toLocaleString()}
              </small>
              <span className="badge bg-success">
                {post.reactions} reactions
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Post;