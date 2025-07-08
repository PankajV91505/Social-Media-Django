import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert('User registered successfully. Please login.');
      navigate('/login');
    } else {
      alert('Registration failed. Try a different username.');
    }
  };

  return (
    <form onSubmit={handleSignup} className="container mt-5">
      <h2>Sign Up</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required className="form-control mb-3" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-control mb-3" />
      <button type="submit" className="btn btn-success">Sign Up</button>
    </form>
  );
};

export default Signup;
