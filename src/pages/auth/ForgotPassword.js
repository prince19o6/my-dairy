import React, { useState } from 'react';
import {
  TextField,
  Button,
  InputAdornment,
  Alert,
  Card,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({
    type: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would typically make an API call to send reset email
      console.log('Password reset requested for:', email);
      setStatus({
        type: 'success',
        message: 'Password reset instructions have been sent to your email.',
      });
      setSubmitted(true);
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Failed to send reset instructions. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <Typography variant="h4" className="font-bold text-gray-900">
            Forgot Password
          </Typography>
          <Typography variant="body2" className="mt-2 text-gray-600">
            Enter your email address and we'll send you instructions to reset your password
          </Typography>
        </div>

        {status.message && (
          <Alert severity={status.type} className="mt-4">
            {status.message}
          </Alert>
        )}

        {!submitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
             
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              className="bg-primary-600 hover:bg-primary-700"
            >
              Send Reset Instructions
            </Button>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <Typography variant="body1" className="text-center text-gray-600">
              Please check your email for further instructions.
              If you don't receive an email within a few minutes, check your spam folder.
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSubmitted(false);
                setEmail('');
                setStatus({ type: '', message: '' });
              }}
            >
              Try another email
            </Button>
          </div>
        )}

        <div className="mt-4">
          <Link
            to="/login"
            className="flex items-center justify-center text-sm text-primary-600 hover:text-primary-500"
          >
            <ArrowBackIcon className="w-4 h-4 mr-2" />
            Back to Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword; 