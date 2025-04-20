import React, { useState } from 'react';
import { account } from '../appwrite-config';
import { useSearchParams, useNavigate } from 'react-router-dom';

function NewPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const userId = searchParams.get('userId');
    const secret = searchParams.get('secret');

    if (!userId || !secret) {
      setError('Invalid recovery link.');
      return;
    }

    try {
      await account.updateRecovery(userId, secret, password, confirmPassword);
      setSuccess('Password reset successfully!');
      // Optionally, redirect to the login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Reset Password</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default NewPassword;