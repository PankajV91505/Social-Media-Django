import { createContext, useReducer, useState } from "react";

export const PostList = createContext({
  postList: [],
  addPost: () => {},
  addInitialPosts: () => {},
  deletePost: () => {},
  updatePost: () => {},
  token: null,
  username: null,
  login: () => {},
  logout: () => {},
});

const postListReducer = (currPostList, action) => {
  switch (action.type) {
    case "DELETE_POST":
      return currPostList.filter((post) => post.id !== action.payload.postId);
    case "ADD_INITIAL_POSTS":
      return action.payload.posts;
    case "ADD_POST":
      return [action.payload.post, ...currPostList];  // ✅ add to top
    case "UPDATE_POST":
      return currPostList.map((post) =>
        post.id === action.payload.post.id ? action.payload.post : post
      );
    default:
      return currPostList;
  }
};

const PostListProvider = ({ children }) => {
  const [postList, dispatchPostList] = useReducer(postListReducer, []);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  const login = (newToken, newUsername) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    setToken(newToken);
    setUsername(newUsername);
    console.log('✅ Logged in:', newUsername);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
  };

  const addPost = async (postTitle, postBody, reactions, tags) => {
    try {
      const response = await fetch("http://localhost:8000/api/posts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: postTitle,
          body: postBody,
          reactions: reactions || 0,
          tags: Array.isArray(tags) ? tags : tags.split(' ').filter(tag => tag.trim() !== ''),
        }),
      });

      if (!response.ok) throw new Error('❌ Failed to create post');

      const newPost = await response.json();

      dispatchPostList({
        type: "ADD_POST",
        payload: { post: newPost },  // ✅ Push new post into list
      });

      return newPost;  // ✅ So calling component can navigate or show toast
    } catch (error) {
      console.error("❌ Error adding post:", error.message);
      throw error;
    }
  };

  const addInitialPosts = (posts) => {
    if (!Array.isArray(posts)) {
      console.error("❌ addInitialPosts expected an array, got:", posts);
      return;
    }

    dispatchPostList({
      type: "ADD_INITIAL_POSTS",
      payload: { posts },
    });
  };

  const deletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/posts/${postId}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('❌ Failed to delete post');

      dispatchPostList({
        type: "DELETE_POST",
        payload: { postId },
      });
    } catch (error) {
      console.error("❌ Error deleting post:", {
        error: error.message,
        postId
      });
      throw error;
    }
  };

  const updatePost = async (postId, updatedData) => {
    try {
      const formattedData = {
        ...updatedData,
        tags: Array.isArray(updatedData.tags)
          ? updatedData.tags
          : updatedData.tags.split(' ').filter(tag => tag.trim() !== '')
      };

      const response = await fetch(`http://localhost:8000/api/posts/${postId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) throw new Error('❌ Failed to update post');

      const updatedPost = await response.json();

      dispatchPostList({
        type: "UPDATE_POST",
        payload: { post: updatedPost },
      });

      return true;
    } catch (error) {
      console.error("❌ Update post error:", {
        error: error.message,
        postId,
        updatedData
      });
      throw error;
    }
  };

  return (
    <PostList.Provider
      value={{
        postList,
        addPost,
        addInitialPosts,
        deletePost,
        updatePost,
        token,
        username,
        login,
        logout,
      }}
    >
      {children}
    </PostList.Provider>
  );
};

export default PostListProvider;
