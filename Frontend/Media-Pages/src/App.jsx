import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/SideBar";
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import PostListProvider, { PostList as PostListContext } from "./store/Post-list-store1";

function App() {
  const [selectedTab, setSelectedTab] = useState("Home");

  return (
    <PostListProvider>
      <Router>
        <Header />
        <div className="app-container">
          <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          <div className="content">
            <Routes>
              <Route path="/" element={<ProtectedRoute><PostList /></ProtectedRoute>} />
              <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </Router>
    </PostListProvider>
  );
}

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(PostListContext);
  return token ? children : <Navigate to="/login" />;
};

export default App;
