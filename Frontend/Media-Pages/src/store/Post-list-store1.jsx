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
      return [action.payload.post, ...currPostList];
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

  const getCsrfToken = async () => {
    try {
      // First ensure we have a CSRF token
      await fetch("http://localhost:8000/api/csrf/", {
        method: 'GET',
        credentials: 'include'
      });

      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];

      if (!csrfToken) {
        throw new Error('CSRF token not found');
      }

      return csrfToken;
    } catch (error) {
      console.error("Error getting CSRF token:", error);
      throw error;
    }
  };

  const addPost = async (postTitle, postBody, reactions, tags) => {
    try {
      const csrfToken = await getCsrfToken();

      const response = await fetch("http://localhost:8000/api/posts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: postTitle,
          body: postBody,
          reactions: reactions || 0,
          tags: Array.isArray(tags) ? tags : tags.split(' ').filter(tag => tag.trim() !== ''),
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create post');
      }

      const newPost = await response.json();
      dispatchPostList({
        type: "ADD_POST",
        payload: { post: newPost },
      });
      return newPost;
    } catch (error) {
      console.error("Error adding post:", {
        error: error.message,
        postTitle,
        postBody,
        reactions,
        tags
      });
      throw error;
    }
  };

  const addInitialPosts = (posts) => {
    if (!Array.isArray(posts)) {
      console.error("addInitialPosts expected an array but got:", posts);
      return;
    }
    dispatchPostList({
      type: "ADD_INITIAL_POSTS",
      payload: { posts },
    });
  };

  const deletePost = async (postId) => {
    try {
      const csrfToken = await getCsrfToken();

      const response = await fetch(`http://localhost:8000/api/posts/${postId}/`, {
        method: "DELETE",
        headers: {
          "X-CSRFToken": csrfToken,
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete post');
      }

      dispatchPostList({
        type: "DELETE_POST",
        payload: { postId },
      });
    } catch (error) {
      console.error("Error deleting post:", {
        error: error.message,
        postId
      });
      throw error;
    }
  };

  const updatePost = async (postId, updatedData) => {
    try {
      const csrfToken = await getCsrfToken();

      // Ensure tags are properly formatted
      const formattedData = {
        ...updatedData,
        tags: Array.isArray(updatedData.tags) ? 
              updatedData.tags : 
              updatedData.tags.split(' ').filter(tag => tag.trim() !== '')
      };

      const response = await fetch(`http://localhost:8000/api/posts/${postId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Update failed with response:", {
          status: response.status,
          errorData
        });
        throw new Error(errorData.message || `Update failed with status ${response.status}`);
      }

      const updatedPost = await response.json();
      
      dispatchPostList({
        type: "UPDATE_POST",
        payload: { post: updatedPost },
      });

      return true;
    } catch (error) {
      console.error("Update post error:", {
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
        updatePost 
      }}
    >
      {children}
    </PostList.Provider>
  );
};

export default PostListProvider;