import React, { useState } from 'react';
import { useLoginMutation, useRegisterMutation } from '../utils/api/authSlice';
import { getUserToken } from '../utils/loginUtils';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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
      const fetchBody = isLogin
        ? { username, password }
        : {
            username,
            password,
            first_name: firstName,
            last_name: lastName,
            email,
          };
      console.log(fetchBody);
      const data = await authMethod(fetchBody).unwrap();
      console.log(data);
      setSuccessMessage(data.message);
    } catch (error) {
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      const activeToken = await getUserToken();
      if (activeToken) {
        navigation.navigate('User Home');
      }
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleAction} style={styles.form}>
        <div style={styles.header}>
          <div style={styles.text}>{authType}</div>
          <div style={styles.underline}></div>
        </div>
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        <div className="inputs">
          <div style={styles.input}>
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.inputField}
            />
          </div>
          <div style={styles.input}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.inputField}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={styles.showHideButton}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {!isLogin ? (
            <div style={styles.input}>
              <input
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={styles.inputField}
              />
            </div>
          ) : (
            ''
          )}
          {!isLogin ? (
            <div style={styles.input}>
              <input
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={styles.inputField}
              />
            </div>
          ) : (
            ''
          )}
          {!isLogin ? (
            <div style={styles.input}>
              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.inputField}
              />
            </div>
          ) : (
            ''
          )}
        </div>
        {error && <div style={styles.errorMessage}>{error}</div>}
        <button style={styles.submit}>{authType}</button>
      </form>
      <p style={styles.toggle}>
        {oppositeAuthCopy}{' '}
        <a onClick={() => setIsLogin(!isLogin)} style={styles.toggleLink}>
          {oppositeAuthType}
        </a>
      </p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  form: {
    width: '400px',
    border: '1px solid #ccc',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  text: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  underline: {
    height: '2px',
    backgroundColor: '#333',
  },
  successMessage: {
    marginBottom: '15px',
    color: 'green',
  },
  inputs: {
    marginBottom: '15px',
  },
  input: {
    position: 'relative',
    marginBottom: '10px',
  },
  inputField: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  showHideButton: {
    position: 'absolute',
    right: '5px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  errorMessage: {
    marginBottom: '15px',
    color: 'red',
  },
  submit: {
    width: '100%',
    padding: '10px',
    fontSize: '18px',
    borderRadius: '5px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  toggle: {
    marginTop: '15px',
    textAlign: 'center',
  },
  toggleLink: {
    cursor: 'pointer',
    color: '#007BFF',
  },
};
export default Login;
