import React, { useState } from 'react';

const Login = ({ setToken, navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAction = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // const apiUrl = action === 'register' ? 'registerUrl' : 'loginUrl';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid Email or Password. Please try again.');
      }

      const data = await response.json();
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
            type="email"
            placeholder="Email Id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
