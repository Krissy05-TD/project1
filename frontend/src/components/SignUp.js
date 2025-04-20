import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
    const [confirmPassword, setConfirmPassword] = useState('');
  const [otpMethod, setOtpMethod] = useState('email'); // Default to email
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Reset phoneNumber if OTP method is not SMS
    if (otpMethod !== 'sms') {
      setPhoneNumber('');
    }
  }, [otpMethod]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    let response;
    try {
      if (otpMethod === 'sms') {
        // Call sendSmsOtp function using fetch
        // Replace 'YOUR_SEND_SMS_OTP_FUNCTION_ENDPOINT' with your actual function endpoint
        response = await fetch('https://cloud.appwrite.io/v1/functions/6804b770001ed488472f/executions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phoneNumber }),
        });
      }  else {
        // Call sendEmailOtp function using fetch
        // Replace 'YOUR_SEND_EMAIL_OTP_FUNCTION_ENDPOINT' with your actual function endpoint
        response = await fetch('https://cloud.appwrite.io/v1/functions/6804b7d6003e5d6978c0/executions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
      }
      const data = await response.json();
      if (data.success) {
        setSuccess(`OTP sent successfully via ${otpMethod}.`);
        // Redirect to OTP verification page with all data
        navigate('/otp-verification', { state: { firstName, lastName, email, password, phoneNumber, otpMethod } });
      } else {
        setError(data.error || 'Failed to send OTP.');
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
         <div>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="email"
              checked={otpMethod === 'email'}
              onChange={(e) => setOtpMethod(e.target.value)}
            />
            Email
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="sms"
              checked={otpMethod === 'sms'}
              onChange={(e) => setOtpMethod(e.target.value)}
            />
            SMS
          </label>
        </div>

        {otpMethod === 'sms' && (
          <div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required={otpMethod === 'sms'}
            />
          </div>
        )}

        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
            <div>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default SignUp;
