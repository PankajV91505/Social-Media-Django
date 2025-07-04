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
      // Filter out any duplicates by ID
      const newPosts = action.payload.posts.filter(
        newPost => !currPostList.some(existingPost => existingPost.id === newPost.id)
      );
      return [...newPosts, ...currPostList];
    
    case "ADD_POST":
      // Check if post already exists
      if (currPostList.some(post => post.id === action.payload.id)) {
        console.warn("Duplicate post detected, not adding:", action.payload);
        return currPostList;
      }
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

  const addPost = (postId, userId, postTitle, postBody, reactions, tags) => {
    console.log("Adding post with ID:", postId);
    dispatchPostList({
      type: "ADD_POST",
      payload: {
        id: postId,
        title: postTitle,
        body: postBody,
        reactions: reactions || 0,
        userId: userId || 1, // Default user ID
        tags: tags || [],
        createdAt: new Date().toISOString()
      },
    });
  };

  const addInitialPosts = (posts) => {
    dispatchPostList({
      type: "ADD_INITIAL_POSTS",
      payload: { posts },
    });
  };

  const deletePost = (postId) => {
    dispatchPostList({
      type: "DELETE_POST",
      payload: { postId },
    });
  };

  const updatePost = (postId, updatedData) => {
    dispatchPostList({
      type: "UPDATE_POST",
      payload: { ...updatedData, id: postId },
    });
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