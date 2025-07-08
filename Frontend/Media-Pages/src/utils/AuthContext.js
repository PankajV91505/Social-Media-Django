import { createContext, useReducer, useEffect } from "react";

export const PostList = createContext();

const initialState = {
  token: localStorage.getItem("token") || null,
  username: localStorage.getItem("username") || null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, token: action.payload.token, username: action.payload.username };
    case "LOGOUT":
      return { ...state, token: null, username: null };
    default:
      return state;
  }
};

const PostListProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = (token, username) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    dispatch({ type: "LOGIN", payload: { token, username } });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token && username) {
      dispatch({ type: "LOGIN", payload: { token, username } });
    }
  }, []);

  return (
    <PostList.Provider
      value={{
        token: state.token,
        username: state.username,
        login,
        logout,
      }}
    >
      {children}
    </PostList.Provider>
  );
};

export default PostListProvider;
