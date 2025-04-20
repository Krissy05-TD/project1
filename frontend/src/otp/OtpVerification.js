import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { account } from '../appwrite-config';

function OtpVerification() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { firstName, lastName, email, password, phoneNumber, otpMethod } = location.state || {};

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp || (!email && !phoneNumber) || !otpMethod) {
     setError('Invalid verification data.');
      return;
    }

    try {
      // Call the verifyOtp function using fetch
      // Replace 'YOUR_VERIFY_OTP_FUNCTION_ENDPOINT' with your actual function endpoint
      const response = await fetch('verifyOtp: https://cloud.appwrite.io/v1/functions/6804b9970034042a055a/executions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({ otp, email, phoneNumber, otpMethod }),
      });

      const data = JSON.parse(response.result);
      if (data.success) {
        setSuccess('OTP verified successfully!');

        // For now, assume signup and create the account
        try {
          const user = await account.create('unique()', email, password, `${firstName} ${lastName}`);
          setSuccess('Account created successfully!');
          console.log(user);
          // Optionally, redirect to a login page or dashboar
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } catch (err) {
          setError(err.message);
          console.error(err);
        }
      } else {
        setError(data.error || 'Invalid OTP.');
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div>
      <h2>OTP Verification</h2>
      <p>Please enter the OTP sent to your {otpMethod === 'sms' ? 'phone' : 'email'}.</p>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        /><br />
        <button type="submit">Verify</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}\n      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default OtpVerification;