import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../contexts/authContext';

function Signup() {
  const navigate = useNavigate();
  const auth = getAuth();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsRegistering(true);
      setError('');
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      console.log('User created:', userCredential.user);
      
      navigate('/home');
      
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message);
    } finally {
      setIsRegistering(false);
    }
  };

  if (currentUser) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div>
      <h2>Signup</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" disabled={isRegistering}>
          {isRegistering ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;