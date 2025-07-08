import { useState, useContext } from 'react';
import { PostList } from '../store/Post-list-store1';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(PostList);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.access, username);  // ✅ Save token in context
        alert('Login successful');
        navigate('/');
        window.location.reload(); // ✅ Force PostList to reload with token
      } else if (response.status === 401 || response.status === 400) {
        setError('Invalid username or password');
      } else {
        setError('Something went wrong, please try again');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error, please try again later');
    }
  };

  return (
    <form onSubmit={handleLogin} className="container mt-5">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="form-control mb-3"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="form-control mb-3"
      />
      <button type="submit" className="btn btn-primary">Login</button>
    </form>
  );
};

export default Login;
