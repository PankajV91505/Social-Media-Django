import { useContext, useState, useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
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
      ? post.tags.join(" ")
      : typeof post.tags === "string"
      ? post.tags
      : "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const isOwner = post.username === username;

  useEffect(() => {
    setEditedPost({
      title: post.title,
      body: post.body,
      reactions: post.reactions,
      tags: Array.isArray(post.tags) ? post.tags.join(" ") : "",
    });
  }, [post]);

  const handleSave = async () => {
    if (!editedPost.title.trim() || !editedPost.body.trim()) {
      setError("Title and body cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      const success = await updatePost(post.id, {
        ...editedPost,
        tags: editedPost.tags.split(" ").filter((t) => t),
      });
      if (success) setIsEditing(false);
    } catch (err) {
      setError("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Delete this post?")) {
      deletePost(post.id);
    }
  };

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body d-flex flex-column">
        {isEditing ? (
          <>
            <input
              className="form-control mb-2"
              value={editedPost.title}
              onChange={(e) =>
                setEditedPost({ ...editedPost, title: e.target.value })
              }
            />
            <textarea
              className="form-control mb-2"
              rows={4}
              value={editedPost.body}
              onChange={(e) =>
                setEditedPost({ ...editedPost, body: e.target.value })
              }
            />
            <input
              className="form-control mb-2"
              value={editedPost.tags}
              onChange={(e) =>
                setEditedPost({ ...editedPost, tags: e.target.value })
              }
              placeholder="tags (space separated)"
            />
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-sm btn-secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button
                className="btn btn-sm btn-success"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </>
        ) : (
          <>
            <h5 className="card-title">{post.title}</h5>
            <p className="text-muted mb-1">By <strong>{post.username}</strong></p>
            <p className="card-text mb-2">
              {showFullBody || post.body.length <= 100
                ? post.body
                : `${post.body.slice(0, 100)}...`}
              {post.body.length > 100 && !showFullBody && (
                <button className="btn btn-link btn-sm p-0 ms-1" onClick={() => setShowFullBody(true)}>
                  Read more
                </button>
              )}
            </p>
            <small className="text-muted">
              Updated: {new Date(post.updated_at || post.created_at).toLocaleString()}
            </small>
            <div className="my-2">
              {(Array.isArray(post.tags) ? post.tags : post.tags?.split(" ") || []).map((tag) => (
                <span key={tag} className="badge bg-primary me-1">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="d-flex justify-content-between align-items-center mt-auto">
              <span className="badge bg-success">{post.reactions} reactions</span>
              {isOwner && (
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => setIsEditing(true)}>
                    <AiFillEdit />
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
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
