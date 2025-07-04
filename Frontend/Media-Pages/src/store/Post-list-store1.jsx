import { createContext, useReducer } from "react";

export const PostList = createContext({
  postList: [],
  addPost: () => {},
  addInitialPosts: () => {},
  deletePost: () => {},
  updatePost: () => {},
});

const postListReducer = (currPostList, action) => {
  switch (action.type) {
    case "DELETE_POST":
      return currPostList.filter((post) => post.id !== action.payload.postId);
    case "ADD_INITIAL_POSTS":
      return action.payload.posts;
    case "ADD_POST":
      return [action.payload, ...currPostList];
    case "UPDATE_POST":
      return currPostList.map((post) =>
        post.id === action.payload.id ? action.payload : post
      );
    default:
      return currPostList;
  }
};

const PostListProvider = ({ children }) => {
  const [postList, dispatchPostList] = useReducer(postListReducer, []);

  const addPost = async (userId, postTitle, postBody, reactions, tags) => {
    try {
      const response = await fetch("http://localhost:8000/api/posts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: postTitle,
          body: postBody,
          reactions: reactions || 0,
          tags: tags,
          user: userId,
        }),
      });
      const newPost = await response.json();
      dispatchPostList({
        type: "ADD_POST",
        payload: newPost,
      });
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const addInitialPosts = (posts) => {
    dispatchPostList({
      type: "ADD_INITIAL_POSTS",
      payload: {
        posts,
      },
    });
  };

  const deletePost = async (postId) => {
    try {
      await fetch(`http://localhost:8000/api/posts/${postId}/`, {
        method: "DELETE",
      });
      dispatchPostList({
        type: "DELETE_POST",
        payload: {
          postId,
        },
      });
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const updatePost = async (postId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:8000/api/posts/${postId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      const updatedPost = await response.json();
      dispatchPostList({
        type: "UPDATE_POST",
        payload: updatedPost,
      });
      return true;
    } catch (error) {
      console.error("Error updating post:", error);
      return false;
    }
  };

  return (
    <PostList.Provider
      value={{ postList, addPost, addInitialPosts, deletePost, updatePost }}
    >
      {children}
    </PostList.Provider>
  );
};

export default PostListProvider;