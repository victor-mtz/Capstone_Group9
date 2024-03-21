import React, { useState } from 'react';

const Login = ({ setToken, navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAction = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // const apiUrl = action === 'register' ? 'registerUrl' : 'loginUrl';
      const apiUrl = 'http://localhost:5433/api/users/login';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid Email or Password. Please try again.');
      }

      const data = await response.json();
      console.log(data);
      setSuccessMessage(data.message);
      setToken(data.token);
    } catch (error) {
      setError(error.message || 'An error occurred. Please try again.');
    }
  };

  // const title = action === 'login' ? 'Login' : 'Signup';

  return (
    <form onSubmit={handleAction} className="container">
      <div className="header">
        <div className="text">Nothing</div>
        <div className="underline"></div>
      </div>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <div className="inputs">
        <div className="input">
          <input
            placeholder="username"
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
      <button className="submit">Nothing</button>
    </form>
  );
};

export default Login;
