import { useContext, useState } from "react";
import {  AiFillEdit } from "react-icons/ai";
import { TiDelete } from "react-icons/ti";
import { PostList } from "../store/Post-list-store1";

const Post = ({ post }) => {
  const { deletePost, updatePost } = useContext(PostList);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({ ...post });

  const handleEdit = async () => {
    const success = await updatePost(post.id, {
      title: editedPost.title,
      body: editedPost.body,
      reactions: editedPost.reactions,
      tags: editedPost.tags,
    });
    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <div className="card post-card mb-4">
      <div className="card-body">
        {isEditing ? (
          <div className="edit-form">
            <input
              className="form-control mb-2"
              value={editedPost.title}
              onChange={(e) =>
                setEditedPost({ ...editedPost, title: e.target.value })
              }
            />
            <textarea
              className="form-control mb-2"
              rows="3"
              value={editedPost.body}
              onChange={(e) =>
                setEditedPost({ ...editedPost, body: e.target.value })
              }
            />
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-success btn-sm me-2"
                onClick={handleEdit}
              >
                Save
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-start">
              <h5 className="card-title mb-3">{post.title}</h5>
              <div>
                <AiFillEdit
                  className="text-primary me-2 fs-5"
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsEditing(true)}
                />
                <TiDelete
                  className="text-danger fs-5"
                  style={{ cursor: "pointer" }}
                  onClick={() => deletePost(post.id)}
                />
              </div>
            </div>
            <p className="card-text mb-3">{post.body}</p>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                {post.tags?.map((tag) => (
                  <span key={tag} className="badge bg-primary me-1">
                    #{tag}
                  </span>
                ))}
              </div>
              <small className="text-muted">
                {new Date(post.created_at).toLocaleString()}
              </small>
            </div>
            <div className="alert alert-success mt-3 mb-0" role="alert">
              This post has {post.reactions} reactions
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Post;