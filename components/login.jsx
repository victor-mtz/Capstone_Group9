import React, { useState } from 'react';
import { useLoginMutation, useRegisterMutation } from '../utils/api/authSlice';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const authType = isLogin ? 'Login' : 'Register';
  const oppositeAuthCopy = isLogin
    ? "Don't have an account?"
    : 'Already have an account?';
  const oppositeAuthType = isLogin ? 'Register' : 'Login';

  // redux code below
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  // redux code above

  const handleAction = async (e) => {
    e.preventDefault();
    setError('');
    const authMethod = isLogin ? login : register;

    try {
      const data = await authMethod({ username, password }).unwrap();
      console.log(data);
      setSuccessMessage(data.message);
    } catch (error) {
      setError(error.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleAction} className="container">
        <div className="header">
          <div className="text">{authType}</div>
          <div className="underline"></div>
        </div>
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        <div className="inputs">
          <div className="input">
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        <button className="submit">{authType}</button>
      </form>
      <p>
        {oppositeAuthCopy}{' '}
        <a onClick={() => setIsLogin(!isLogin)}>{oppositeAuthType}</a>
      </p>
    </div>
  );
};

export default Login;
