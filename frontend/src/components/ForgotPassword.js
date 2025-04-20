import React, { useState } from 'react';
import { account } from '../appwrite-config';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await account.createRecovery(
        email,
        'http://localhost:3000/reset-password' // Replace with your actual reset password URL
      );
      setSuccess('If an account with that email exists, a password recovery email has been sent.');
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default ForgotPassword;